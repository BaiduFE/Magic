
  resources 为 tangram-ui 的资源目录，请将此目录布署到适合的位置，在开始写 ui 组
  件的使用代码之前，先用 magic.resourcePath = "资源目录地址" 来告诉 tangram 你
  把 resources 布署到哪里，地址相对于当前页面。

  default 目录为皮肤目录，里面存放与皮肤相关的 css 与图片文件，default 为 tangram
  的默认皮肤，如果想应用自己的皮肤，可以把 default 拷贝一份，放于与 default 同级
  目录下，目录名称即为皮肤名称，并且将目录里面的样式与图片按自己的皮肤需求进行更
  改。网页上如果应用定制的新皮肤，请使用 magic.skinName = "皮肤名称"