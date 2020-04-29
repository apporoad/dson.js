
## 文档维护

```bash
npm i -g vuepress

cd demo

vuepress build pages -d temp

rm -rf docs/assets/
cp  -rf temp/*  docs/
sed -i 's/\/assets/assets/g' docs/index.html

```


## 如何打包

```bash
npm i -g browserify

browserify -r ./index.js:dson.js -o docs/js/dson.js

```