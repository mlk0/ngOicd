// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
 
  API_HOST : 'https://dev-ws-esa.np.dhltd.com',
  CLIENT_HOST : 'http://localhost:4200',
  IDENTITY_CLIENT_ID : 'spa_dev',
  PRODUCT_CODE : 'ESRBC-FR'
   
};
