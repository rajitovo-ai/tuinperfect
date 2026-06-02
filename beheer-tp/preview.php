<?php
/**
 * preview.php — Rendert een e-mail preview met demo-data.
 * Type: offerte | bevestiging
 */
require_once __DIR__ . '/helpers.php';
secure_session_start();

require_auth();
check_timeout();

$cfg = include __DIR__ . '/../site-config.php';
$smtp = [];
if (file_exists(__DIR__ . '/../smtp_config.php')) {
    $smtp = include __DIR__ . '/../smtp_config.php';
}

require_once __DIR__ . '/../smtp_mailer.php';

$type = $_GET['type'] ?? 'offerte';

// Demo data
$demo_naam     = 'Jan Jansen';
$demo_telefoon = '06 12345678';
$demo_email    = 'jan@example.com';
$demo_dienst   = $cfg['diensten'][array_key_first($cfg['diensten'] ?? [])] ?? 'Vrijblijvende offerte aanvragen';

// Branche-specifieke preview-bericht (uit site-config, gegenereerd door de workflow)
$demo_bericht  = $cfg['preview_bericht'] ?? 'Hallo, ik ben geïnteresseerd in uw diensten en zou graag meer informatie ontvangen. Kunt u contact met mij opnemen voor een vrijblijvend gesprek?';
$demo_bev_tekst = $smtp['bev_bericht'] ?? "Hartelijk dank voor uw aanvraag. Wij hebben uw bericht in goede orde ontvangen en gaan er direct mee aan de slag. Binnen 1 werkdag nemen wij contact met u op om de mogelijkheden te bespreken.";

if ($type === 'offerte') {
    $html = bouw_offerte_html($demo_naam, $demo_telefoon, $demo_email, $demo_dienst, $demo_bericht, $cfg);
} else {
    $html = bouw_bevestiging_html($demo_naam, $demo_dienst, $demo_bev_tekst, $demo_bericht, $cfg);
}

header('Content-Type: text/html; charset=utf-8');
header('X-Frame-Options: SAMEORIGIN');
echo $html;
