npm run build
rm -fr ./iReach/hosting/files
mkdir ./iReach/hosting/files
cp -R ./build/* ./iReach/hosting/files
cd iReach
realm-cli push --include-hosting --reset-cdn-cache
cd ..
