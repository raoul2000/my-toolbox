
// from the tomcat install folder
//java -cp ./lib/catalina.jar org.apache.catalina.util.ServerInfo | head -n 1 | cut -d ':' -f 2
//
exports.extract = function(data) {
  return data.trim();
};
