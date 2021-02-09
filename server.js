const AV = require("leanengine");
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});
AV.Cloud.useMasterKey();
const app = require("./app");
const PORT = parseInt(
  process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000
);
app.listen(PORT);
//updated
