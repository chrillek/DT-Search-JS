function run(argv) {
  const se = Application("System Events");
  
  const supportPath = se.userDomain.applicationSupportFolder.posixPath();
  
  const plistPath = `${supportPath}/DEVONthink 3/Favorites.plist`;
  const plist = se.propertyListFiles[plistPath];
  
  const items = [];
  plist.propertyListItems().forEach(it => {
    if ('UUID' in it.value()) {
        const v = it.value();
        items.push({title: v.Name, arg: v.UUID});
    }
  })
  return( JSON.stringify({items: 
      (items.length > 0 ? items : [{title: "No favorite items", subtitle: "(*´･д･)?"}])
    })
  );
}
