<template>
  <div id="ShoppingCart">

    <h3>{{ msg }}</h3>

    <table>
      <tr>
        <th v-for="titleItem in productTitle">
          {{ titleItem }}
        </th>
      </tr>
      <!--遍历元素和索引都是可以的-->
      <tr v-for="(item,index) in productList">
        <td>
          <h4>{{ index }}</h4>
          <input type="checkbox" v-bind:checked="item.checked" v-on:click="checkProduct(item)"/>
          <img v-bind:src="item.productImg"/>
          <p class="titleClass">{{ item.productName }}</p>
          <h6 v-for="itemParts in item.parts">
            产品类型: {{itemParts.partsName }}
          </h6>
        </td>
        <td>
          {{ item.productPrice | fomatterMoney }}
        </td>
        <td>
          <a href="javascript:" v-on:click="changeMoney(item, -1)">-</a>
          <!--双向绑定产品数量，用于计算总额-->
          <input type="text" value="0" v-model="item.productQty"/>
          <a href="javascript:" @click="changeMoney(item, 1)">+</a>

        </td>
        <td class="totalClass">

          {{ item.productPrice * item.productQty | money(" 元")}}
        </td>
        <td>


          <a href="javascript:" @click="deleteDialog(item)">删除</a>
        </td>
      </tr>
    </table>

    <div class="leftFooter">

      <input type="checkbox" :checked="checkAllFlay" @click="checkAll(true);"/>

      <a href="javascript:" @click="checkAll(true)">全选</a>

      <a href="javascript:" @click="checkAll(false)">取消全选</a>

      <router-link  to="/Address" class="calClass">结算</router-link>

    </div>

    <div class="rightFooter">
      总金额：<span> {{ totalPrices | fomatterMoney }} </span>


    </div>


    <div class="bgclass" v-if="!isShowFlag"> </div>
      <div class="dialogClass" :class="{'isShow': isShowFlag }">
        <h3>提示</h3>
        <p>是否删除？</p>
        <a href="javascript:;" @click="cancalDelete()">取消</a>
        <a href="javascript:;" v-on:click="comfireDelete();">确定</a>
      </div>



  </div>
</template>

<script>

  import Vue from 'vue';

  export default {
    name: "ShoppingCart",
    data() {
      return {
        msg: 'Shopping Cart',
        productList: [],
        totalMoney: 0,
        productTitle: [],
        checkAllFlay: false,
        totalPrices: 0,
        isShowFlag: true,
        currentProduct: "",
      }
    },
    //过滤器
    filters: {
      //局部过滤器
      fomatterMoney: function (value) {
        return "¥" + value.toFixed(2);
      }
    },
    //数据初始化完后的加载，使用mounted必须加入$nextTick完整性
    mounted: function () {
      this.$nextTick(function () {
        this.cartView();

      });//钩子函数

    },
    methods: {
      //调用接口，获取后端数据展示 方法
      cartView: function () {
        // get请求 需要向后台传参数 语法：{params:{a:10,b:2}}
        // this.$http.get('get.php',{params:{a:10,b:2}}).then(function(res){}
        let _this = this;
        this.$http.get('static/carData.json').then((res) => {
          //采用es6  =>的方法，可以在函数里面直接用 this,同级
          //采用 => 作用域 内部this和外部this同级了
          this.productTitle = res.body.result.title;
          this.productList = res.body.result.list;
          this.totalMoney = res.body.result.totalMoney;
          console.log(res);
        }, (err) => {
          console.log('json request error!');
        });
      },
      //改变数量，计算金额 方法
      changeMoney: function (product, way) {
        if (way > 0) {
          product.productQty++;
        }
        else {
          product.productQty--;
          if (product.productQty < 1) {
            product.productQty = 1;
          }
        }
        this.calcTotalPrice();
      },
      //单个商品选中 方法
      checkProduct: function (product) {
        if (typeof product.checked == "undefined") {
          // Vue.set(product, "checked", true); //全局注册：给接口返回的数据添加新字段
          //局部注册
          this.$set(product, "checked", true);

        } else {
          product.checked = !product.checked;

        }
        this.calcTotalPrice();
      },
      //全选 或者 取消全选 方法
      checkAll: function (flag) {
        this.checkAllFlay = flag;
        var _this = this;
        this.productList.forEach(function (item, index) {
          if (typeof item.checked == 'undefined') {
            _this.$set(item, 'checked', true);
          } else {
            item.checked = _this.checkAllFlay;
          }

        });
        this.calcTotalPrice();
      },

      //计算总金额方法
      calcTotalPrice: function () {
        var _this = this;
        //清零，才不会历史累加
        _this.totalPrices = 0;
        this.productList.forEach(function (item, index) {
          if (item.checked) {
            _this.totalPrices += item.productPrice * item.productQty;
          }
        })
      },
      //删除开窗方法
      deleteDialog: function (product) {
        this.isShowFlag = !this.isShowFlag;
        this.currentProduct = product;
      },
      //删除开窗取消方法
      cancalDelete: function () {
        this.isShowFlag = !this.isShowFlag;
      },
      //删除开窗确定按钮方法，删除数组
      comfireDelete: function () {
        this.isShowFlag = true;
        var _index = this.productList.indexOf(this.currentProduct);
        this.productList.splice(_index, 1);
      }

    }

  }

  // 全局过滤器,可以在全局所有页面上使用
  Vue.filter("money", function (value, type) {
    return "¥" + value.toFixed(2) + type;
  })
</script>

<style scoped>
  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    table-layout: fixed;
  }

  table th, table td {
    border: 1px solid #000;

  }

  img {
    width: 60px;
    height: 60px;
  }

  .titleClass {
    float: right;
    padding-right: 80px;
    font-weight: bold;
    color: darkred;
  }

  input {
    text-align: center;
    border-radius: 5px;
  }

  .totalClass {
    color: red;
    font-weight: bold;
  }

  .leftFooter {
    text-align: left;
  }

  .rightFooter {
    color: red;
    font-size: 36px;
    font-weight: bold;
  }

  .dialogClass {
    padding: 20px;
    text-align: center;
    z-index: 9999;
    position: absolute;
    top: 30%;
    left: 40%;
    background-color: aqua;
    width: 300px;

  }

  .bgclass {
    background-color: #000;
    opacity: 0.2;
    width: 100%;
    height:100%;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .isShow{
    display: none;
  }
  .calClass{
    float: right;
    padding: 8px 20px;
    background-color: red;
    color: #fff;
    font-size: 18px;
    display: inline-block;
    text-decoration: none;
  }


</style>
