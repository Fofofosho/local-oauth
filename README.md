This code is currently specific to oAuth2.

Code has been customized for Freshbooks integrations.

# Setting up localhost https

1. Create a self-signed root certificate
 - On a mac, use the `Keychain Access` under Utilities.
 - In the application, go to `Certificate Assistant > Create a Certificate`
 - On the "create" screen. Change the name to `localhost`
 - Leave `Identity Type` as `Self Signed Root`
 - Change `Certificate Type` to `SSL Server`
 - Go through and finish.
2. Trust the new root certificate
 - Go find the `localhost` certificate that was just made; can search for it.
 - Expand `Trust` and change the `Secure Sockets Layer (SSL)` to `Always Trust`
3. Use the key!
 - Now you'll need to export the private key into a `.p12` file. You'll be asked to create a password for this file.
 - Run this command to change it to a .pem file, `openssl pkcs12 -in <exported-file>.p12 -out <exported-new-file>.pem -nodes`. You'll be asked for that password again.
 - In that `<exported-new-file>.pem` will contain both the private key and the certificate itself.
 - Copy the certificate information into a `<certificate-name>.pem`.
 - Copy the private key information into a `<private-key-name>.pem`.
 - Now your ready to reference them in the code!
