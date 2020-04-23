### 示例调用接口

1.  首先， 需要<寻找> (获取订单数据) 的[接口]

2.  然后呢，<调用接口> 

   ```js
   {
       'p1' : 'asf'
   }
   
   ```

3. <判断> 接口是否调通

4. 得到结果后 进行<校验>

   ```js
   {    
   }
   ```

   

4.  <寻找>结果中的订单编号 : ('orderId')
5. <记录> 为 (orderid)


```js

d(1, ' 需要<寻找> (获取订单数据) 的接口', d().curl('http://test.com/apis').get())
.do(2, '然后呢，调用接口', d().api())
.do(3, ' <判断> 接口是否调通' )
.if(d({success: '=false'}))
.then(d().return())
.do(4, '得到结果后 进行<校验>')
.do(5, '')




```


```js
Multiverse

line
gate
trigger
event


```