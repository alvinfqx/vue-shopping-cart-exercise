<template>

  <div class="address">
    <div>配送地址</div>

    <!--卡片选择：点击index 赋值给变量 currentChoose ,索引与变量相等时，显示class样式-->
    <div class="blockClass" v-for="(item, index) in filterAddress"
         v-bind:class="{'checkClass': index == currentChoose}" @click="currentChoose = index">

       <p> 姓名：{{ item.userName }} </p>
       <p> 地址：{{ item.streetName }}</p>
       <p> 电话：{{ item.telPhone }}</p>

       <a href="javascript:;" v-if="!item.isDefault" v-on:click="setDefault(item.addressId);"> 设置默认地址 </a>

       <a href="javascript:;" v-if="item.isDefault"> 默认地址 </a>
    </div>

    <a href="javascript:;" class="getmoreclass" v-if="hasLoading"  @click="loadMore()">加载更多...</a>
    <a href="javascript:;" class="getmoreclass" v-else @click="hideMore();"> 收起 </a>


    <div class="shippingDiv">
      <div>配送方式</div>
      <div class="shipClass" v-bind:class="{'shipingCheck': shipingIndex == 1}" @click="shipingIndex = 1">
        <p>标准配送</p>
        <p>Free</p>
      </div>
      <div class="shipClass" v-bind:class="{'shipingCheck': shipingIndex == 2}" @click="shipingIndex = 2">
        <p>高级配送</p>
        <p>180</p>
      </div>
    </div>

  </div>


</template>

<script>
    import Vue from 'vue';


    export default {
      name: "Address",
      data(){
          return {
            addressList: [],
            limitNum: 3,
            hasLoading: true,
            currentChoose: 0,
            shipingIndex: 1
          }
        },
      mounted: function () {
        this.$nextTick(function () {
          this.getAddressList();

        });//钩子函数

      },
      methods:{
         getAddressList: function() {
           var _this = this;
           this.$http.get('static/addressData.json').then((res)  => {
             _this.addressList = res.body.result;
           })
         },
        loadMore: function () {
          this.limitNum = this.addressList.length;
          this.hasLoading = false;
        },
        hideMore: function () {
          this.limitNum = 3;
          this.hasLoading = true;
        },
        //设置为默认
        setDefault: function (addressId) {
          this.addressList.forEach(function (address, index){
            if(address.addressId == addressId){
              address.isDefault = true;
            }else{
              address.isDefault = false;
            }
          })
        }
      },
      filter:  {

      },
      //过滤
      computed: {
        //使用过滤器，用filterAddress代替数组addressList的值
        filterAddress: function () {
          return this.addressList.slice(0,this.limitNum);
        }
      }
    }
</script>

<style scoped>

  .blockClass{
    text-align: left;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 10px 30px;
    width: 200px;
    float: left;
    margin-right: 10px;
    margin-top: 20px;
  }

  .getmoreclass{
    float: none;
    display: block;
    margin-top: 30%;
  }

  .checkClass{
    border:  1px solid red;
    color: red;
    font-weight: bold;
  }

  .shipClass{
    border: 1px solid #000;
    padding: 10px 40px;
    margin: 10px;
    text-align: center;
    width: 250px;
    display: inline-block;
  }

  .shippingDiv{
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }

  .shipingCheck{
    border:  2px solid red;
  }
</style>
