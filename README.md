# Cloud Provider Locations

Map of the major public cloud provider locations: https://cloud-providers.jumpintothe.cloud/.

![](https://where.jumpintothe.cloud/assets/images/map.png)

## Install

```
git clone https://github.com/GuGuss/cloud-providers
cd cloud-providers
npm install
npm build
```

## Develop

```
npm dev
```

Access http://localhost:8080.

## Add a new Cloud Provider location

1. Fill in the providers json in `providers/PROVIDERNAME.json`.
2. Edit the following file `app/map.js` to import the new provider data.

## Contribute

Feel free to contribute to the project and submit pull requests.

## License

This application is under the MIT License (MIT). Read the LICENSE for more information.
