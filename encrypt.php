<?php
// Ключ для шифрования и дешифрования
define('SECRET_KEY', 'your-secret-key-here'); // Измените на свой секретный ключ

function encrypt($data) {
    $cipher = 'AES-128-CTR';
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
    $encrypted = openssl_encrypt($data, $cipher, SECRET_KEY, 0, $iv);
    return base64_encode($encrypted . '::' . $iv);
}

function decrypt($data) {
    $cipher = 'AES-128-CTR';
    list($encrypted_data, $iv) = explode('::', base64_decode($data), 2);
    return openssl_decrypt($encrypted_data, $cipher, SECRET_KEY, 0, $iv);
}
?>
