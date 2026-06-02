<?php
// === STATELESS CSRF HULPFUNCTIES ===
// Hybride: stateless HMAC-token + backward-compat sessie-token.
// Werkt ook op shared-hosting waar PHP-sessies niet betrouwbaar zijn.

/**
 * Laadt of genereert een CSRF-secret uit .rate/.csrf_secret (0600).
 */
function get_csrf_secret(): string {
    $dir   = __DIR__ . '/.rate';
    $pad   = $dir . '/.csrf_secret';
    if (file_exists($pad)) {
        $raw = @file_get_contents($pad);
        if (!empty($raw) && strlen($raw) === 64) {
            return $raw;
        }
    }
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $secret = bin2hex(random_bytes(32));
    $tmp    = $pad . '.tmp.' . getmypid();
    if (@file_put_contents($tmp, $secret, LOCK_EX) !== false) {
        @rename($tmp, $pad);
        @chmod($pad, 0600);
    }
    return $secret;
}

/**
 * Genereert een stateless CSRF-token: base64(timestamp.hash)
 * Geldigheidsduur: 1 uur (3600 seconden).
 */
function generate_csrf_token(): string {
    $secret = get_csrf_secret();
    $ts     = time();
    $hash   = hash_hmac('sha256', (string)$ts, $secret);
    return base64_encode((string)$ts . '.' . $hash);
}

/**
 * Valideert een CSRF-token.
 * 1. Check sessie-token (backward compat).
 * 2. Check stateless HMAC-token (timestamp binnen 1 uur, hash klopt).
 */
function validate_csrf_token(string $token): bool {
    // Stap 1: backward compat — sessie-token (bestaande open pagina's)
    if (!empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token)) {
        return true;
    }

    // Stap 2: stateless HMAC-token
    $decoded = base64_decode($token, true);
    if ($decoded === false || strpos($decoded, '.') === false) {
        return false;
    }
    [$ts, $hash] = explode('.', $decoded, 2);
    if (!ctype_digit($ts)) {
        return false;
    }
    $ts = (int)$ts;
    $now = time();
    if ($ts < ($now - 3600) || $ts > ($now + 60)) {
        return false; // te oud of clock skew
    }
    $secret = get_csrf_secret();
    $expected = hash_hmac('sha256', (string)$ts, $secret);
    return hash_equals($expected, $hash);
}

// === CSRF-TOKEN ENDPOINT (GET) ===
// Geeft een nieuw stateless CSRF-token terug voor het contactformulier.
// Aanroepen via: fetch('mail.php?csrf=1')
if ((isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') && isset($_GET['csrf'])) {
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode(['csrf' => generate_csrf_token()]);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Alleen POST
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode niet toegestaan.']);
    exit;
}

// === SITE CONFIG LADEN ===
$cfg_pad = __DIR__ . '/site-config.php';
$cfg = [];
if (file_exists($cfg_pad)) {
    $cfg = include $cfg_pad;
    if (!is_array($cfg)) {
        $cfg = [];
    }
}

// === HONEYPOT SPAM-BESCHERMING ===
if (!empty($_POST['website_url']) || !empty($_POST['bedrijfsnaam_extra'])) {
    error_log('[HONEYPOT] Spam gedetecteerd van IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    echo json_encode(['success' => true, 'message' => 'Uw aanvraag is verzonden.']);
    exit;
}

// === SESSION + CSRF VALIDATIE ===
require_once __DIR__ . '/beheer-tp/helpers.php';
secure_session_start();

$csrf_token = $_POST['csrf_token'] ?? '';
if (empty($csrf_token) || !validate_csrf_token($csrf_token)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Ongeldige beveiligingstoken. Herlaad de pagina en probeer opnieuw.']);
    exit;
}

// Geen eenmalige token-verversing meer — het stateless token blijft 1 uur geldig.
// Dit voorkomt breuk als het netwerk haperde tussen POST en het ophalen van een nieuw token.

// === RATE LIMITING — dubbele laag: sessie + IP-bestand ===
$ip              = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$limiet_venster  = 600;  // 10 minuten
$max_aanvragen   = 5;
$nu              = time();

// Laag 1: sessie-gebaseerd (voor browsers met cookies)
$sess_key = 'mail_rate_' . md5($ip);
if (!isset($_SESSION[$sess_key])) {
    $_SESSION[$sess_key] = ['count' => 0, 'start' => $nu];
}
if ($nu - $_SESSION[$sess_key]['start'] > $limiet_venster) {
    $_SESSION[$sess_key] = ['count' => 0, 'start' => $nu];
}

// Laag 2: IP-bestandsgebaseerd (lokaal in projectmap voor shared hosting isolatie)
$rate_dir  = __DIR__ . '/.rate';
if (!is_dir($rate_dir)) {
    @mkdir($rate_dir, 0700, true);
}
$rate_file = $rate_dir . '/' . md5($ip) . '.json';
$ip_data   = ['count' => 0, 'start' => $nu];
if (file_exists($rate_file)) {
    $gelezen = json_decode(@file_get_contents($rate_file), true);
    if (is_array($gelezen)) {
        $ip_data = $gelezen;
    }
}
if ($nu - ($ip_data['start'] ?? 0) > $limiet_venster) {
    $ip_data = ['count' => 0, 'start' => $nu];
}

// Blokkeer als één van de twee limieten bereikt is
if ($_SESSION[$sess_key]['count'] >= $max_aanvragen || $ip_data['count'] >= $max_aanvragen) {
    http_response_code(429);
    $tel = htmlspecialchars($cfg['telefoon'] ?? '');
    echo json_encode(['success' => false, 'message' => 'Te veel aanvragen. Probeer het later opnieuw' . ($tel ? " of bel {$tel}." : '.')]);
    exit;
}

// === INVOER OPSCHONEN ===
function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$naam     = clean($_POST['naam']     ?? '');
$email    = clean($_POST['email']    ?? '');
$telefoon = ($cfg['veld_telefoon'] ?? true) ? clean($_POST['telefoon'] ?? '') : '';
$dienst   = ($cfg['veld_dienst']   ?? true) ? clean($_POST['dienst']   ?? '') : '';
$bericht  = ($cfg['veld_bericht']  ?? true) ? clean($_POST['bericht']  ?? '') : '';

// === INPUT LENGTE-LIMITEN ===
$max_len = ['naam' => 100, 'email' => 254, 'telefoon' => 30, 'dienst' => 100, 'bericht' => 5000];
if (strlen($naam)     > $max_len['naam'])     $naam     = substr($naam, 0, $max_len['naam']);
if (strlen($email)    > $max_len['email'])    $email    = substr($email, 0, $max_len['email']);
if (strlen($telefoon) > $max_len['telefoon']) $telefoon = substr($telefoon, 0, $max_len['telefoon']);
if (strlen($dienst)   > $max_len['dienst'])   $dienst   = substr($dienst, 0, $max_len['dienst']);
if (strlen($bericht)  > $max_len['bericht'])  $bericht  = substr($bericht, 0, $max_len['bericht']);

// === VALIDATIE ===
$fouten = [];

if (empty($naam) || strlen($naam) < 2) {
    $fouten[] = 'naam';
}
if (empty($email) || !filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
    $fouten[] = 'email';
}
if (($cfg['veld_telefoon'] ?? true)) {
    if (empty($telefoon)) {
        $fouten[] = 'telefoon';
    } elseif (!preg_match('/[0-9]{8,}/', preg_replace('/[^0-9]/', '', $telefoon))) {
        $fouten[] = 'telefoon_ongeldig';
    }
}
if (($cfg['veld_bericht'] ?? true) && (empty($bericht) || strlen($bericht) < 10)) {
    $fouten[] = 'bericht';
}

if (!empty($fouten)) {
    $veld_namen = [
        'naam'             => 'Uw naam',
        'email'            => 'E-mailadres',
        'telefoon'         => 'Telefoonnummer',
        'telefoon_ongeldig'=> 'Telefoonnummer (minimaal 8 cijfers)',
        'bericht'          => 'Bericht (minimaal 10 tekens)',
    ];
    $fout_velden = array_map(fn($f) => $veld_namen[$f] ?? $f, $fouten);
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Controleer de volgende velden: ' . implode(', ', $fout_velden),
        'fouten'  => $fouten,
    ]);
    exit;
}

// === SMTP CONFIGURATIE LADEN ===
$config_pad = __DIR__ . '/smtp_config.php';
require_once __DIR__ . '/smtp_mailer.php';

if (!file_exists($config_pad)) {
    $fallback = true;
    $smtp = ['ontvanger' => $cfg['email_fallback'] ?? ''];
} else {
    $fallback = false;
    $smtp     = include $config_pad;
}

// Mailer ID uit site-config meegeven
$smtp['mailer_id'] = $cfg['mailer_id'] ?? 'WebMail/2.0';

// === DIENST-LABEL ===
$dienst_label = '';
if (!empty($dienst) && ($cfg['veld_dienst'] ?? true)) {
    $diensten     = $cfg['diensten'] ?? [];
    $dienst_label = $diensten[$dienst] ?? ($dienst ?: 'Niet opgegeven');
}

$ontvanger = $smtp['ontvanger'] ?? ($cfg['email_fallback'] ?? '');
$bedrijf   = $cfg['bedrijfsnaam'] ?? 'Website';
$onderwerp = 'Nieuwe aanvraag via website — ' . $naam;
$host_fallback = ($_SERVER['HTTP_HOST'] ?? 'localhost');

// === VERSTUREN ===
if ($fallback) {
    $inhoud  = "Nieuwe aanvraag\n\nNaam:   {$naam}\nE-mail: {$email}";
    if ($telefoon)     $inhoud .= "\nTelefoon: {$telefoon}";
    if ($dienst_label) $inhoud .= "\nDienst:   {$dienst_label}";
    if ($bericht)      $inhoud .= "\n\nBericht:\n{$bericht}";
    $headers  = "From: noreply@{$host_fallback}\r\nReply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    $ok = mail($ontvanger, $onderwerp, $inhoud, $headers);
} else {
    $html_offerte = bouw_offerte_html($naam, $telefoon, $email, $dienst_label, $bericht, $cfg);
    $result = smtp_verstuur(
        smtp:      $smtp,
        aan:       $ontvanger,
        onderwerp: $onderwerp,
        inhoud:    $html_offerte,
        reply_to:  $email,
        html:      true
    );
    $ok = ($result === true);
    if (!$ok) {
        error_log('[mail.php SMTP fout] ' . $result);
    }
}

// === RATE LIMIT VERHOGEN (alleen na succesvolle validatie) ===
$_SESSION[$sess_key]['count']++;
$ip_data['count']++;
@file_put_contents($rate_file, json_encode($ip_data));

// === RATE LIMIT GARBAGE COLLECTION ===
// Voorkom oneindige groei van .rate/ map op shared hosting.
$rate_files = @glob($rate_dir . '/*.json');
if ($rate_files !== false && count($rate_files) > 50) {
    $cutoff = time() - 86400; // 24 uur
    foreach ($rate_files as $rf) {
        if (@filemtime($rf) < $cutoff) {
            @unlink($rf);
        }
    }
}

// === BEVESTIGINGSMAIL NAAR BEZOEKER ===
if ($ok) {
    // Fix: ?? checkt geen lege string ''. Gebruik !empty() zodat er altijd een fallback is.
    $bev_onderwerp = !empty($smtp['bev_onderwerp']) ? $smtp['bev_onderwerp'] : ('Uw aanvraag is ontvangen — ' . $bedrijf);
    $bev_bericht   = !empty($smtp['bev_bericht'])   ? $smtp['bev_bericht']   : "Hartelijk dank voor uw aanvraag. Wij hebben uw bericht in goede orde ontvangen en gaan er direct mee aan de slag. Binnen 1 werkdag nemen wij contact met u op om de mogelijkheden te bespreken.";

    // Harde vangnet: als het onderwerp toch leeg is (bijv. $bedrijf mist), forceer fallback.
    if (empty($bev_onderwerp)) {
        $bev_onderwerp = 'Uw aanvraag is ontvangen';
    }
    if (empty($bev_bericht)) {
        $bev_bericht = 'Hartelijk dank voor uw aanvraag. Wij hebben uw bericht ontvangen.';
    }

    if ($fallback) {
        $bev_inhoud  = "Beste {$naam},\n\n{$bev_bericht}\n\n";
        if ($dienst_label) $bev_inhoud .= "Dienst: {$dienst_label}\n\n";
        if ($bericht)      $bev_inhoud .= "Uw bericht:\n{$bericht}\n\n";
        $bev_inhoud .= "Met vriendelijke groet,\n{$bedrijf}";
        $bev_headers = "From: noreply@{$host_fallback}\r\nContent-Type: text/plain; charset=UTF-8\r\n";
        mail($email, $bev_onderwerp, $bev_inhoud, $bev_headers);
    } else {
        $html_bevestiging = bouw_bevestiging_html($naam, $dienst_label, $bev_bericht, $bericht, $cfg);
        smtp_verstuur(
            smtp:      $smtp,
            aan:       $email,
            onderwerp: $bev_onderwerp,
            inhoud:    $html_bevestiging,
            reply_to:  $ontvanger,
            html:      true
        );
    }

    echo json_encode([
        'success' => true,
        'message' => 'Uw aanvraag is ontvangen! Wij nemen zo snel mogelijk contact met u op.',
    ]);
} else {
    http_response_code(500);
    $tel = htmlspecialchars($cfg['telefoon'] ?? '');
    echo json_encode([
        'success' => false,
        'message' => 'Er is iets misgegaan bij het versturen.' . ($tel ? " Bel ons op {$tel}." : ''),
    ]);
}
