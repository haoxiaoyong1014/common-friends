<template>
  <div class="layout">
    <layout>
      <Header :style="{position: 'fixed', width: '100%'}">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
          </div>
          <div class="layout-nav">
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>
              redis 案例-共同好友
            </MenuItem>
          </div>
        </Menu>
      </Header>

      <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '500px'}">
        <Row>
          <i-col>
            <Card>
              <Row>
                <i-col span="9">
                  <Card :style="{height: '350px'}">
                    <p slot="title">
                      <Icon type="person-stalker"></Icon>
                      小永的的好友
                    </p>
                    <Tag v-for="item in aFriendData" :key="item" :name="item" closable
                         @on-close="delFriend('xiaoyong',item)" color="green">
                      {{ item }}
                    </Tag>
                  </Card>
                </i-col>
                <i-col span="6">
                  <i-col>
                    <Card :style="{height: '175px'}">
                      <p slot="title">
                        <Icon type="ios-gear"></Icon>
                        操作
                      </p>
                      <Button icon="person-add" @click.native="addFriend()" type="ghost">添加好友</Button>
                    </Card>
                  </i-col>
                  <i-col>
                    <Card :style="{height: '175px'}">
                      <p slot="title">
                        <Icon type="ios-gear"></Icon>
                        操作
                      </p>
                      <Button icon="person" @click.native="intersectFriend()" type="ghost">共同好友</Button>
                      <!--<i-button icon="person" @cilck="differenceFriend" type="ghost">小永独有的好友</i-button>
                      <i-button icon="person" @cilck="unionFriend" type="ghost">所以好友</i-button>-->
                    </Card>
                  </i-col>
                </i-col>
                <i-col span="9">
                  <Card :style="{height: '350px'}">
                    <p slot="title">
                      <Icon type="person-stalker"></Icon>
                      小明的的好友
                    </p>
                    <tag v-for="item in bFriendData" closable @on-close="delFriend('xiaoming',item)" color="blue">{{ item}}</tag>
                    <Tag checkable color="blue">标签一</Tag>
                  </Card>
                </i-col>
                <!--<Footer :style="{height: '500px'}">Footer</Footer>-->
                <i-col span="24">
                  <Card :style="{height: '160px'}">
                    <p slot="title">
                      <Icon type="ios-list-outline"></Icon>
                      {{ resultFrientTitle }}
                    </p>
                    <tag v-for="item in resultFrient" :key="item" :name="item" color="#EF6AFF">{{ item}}</tag>
                  </Card>
                </i-col>
              </Row>
            </Card>
          </i-col>
        </Row>
      </Content>
      <Footer class="layout-footer-center">2018 &copy; TalkingData</Footer>
    </layout>
    <Modal title="添加好友" v-model="modalVisible" :mask-closable=false width="400" :styles="{top: '30px'}">
      <Form ref="form" :model="form" :label-width="80">
        <form-item label="用户" prop="user">
          <i-select v-model="form.user">
            <i-option value="xiaoyong">小永</i-option>
            <i-option value="xiaoming">小明</i-option>
          </i-select>
        </form-item>
        <FormItem label="好友">
          <Input v-model="form.friend"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click.native="cancel()">取消</Button>
        <Button type="primary" :loading="submitLoading" @click.native="submit()">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import 'axios/dist/axios.js'


  export default {
    name: "friends",
    data() {
      return {
        bFriendData: [],
        resultFrient: [],
        msg: 'haoxiao',
        aFriendData: [],
        modalVisible: false,
        submitLoading: false,
        resultFrientTitle: "",
        form: {
          user: '',
          friend: ''
        },
        formValidate: {
          user: [
            {required: true, message: '请选择用户', trigger: 'blur'}
          ],
          friend: [
            {required: true, message: '请输入好友名称', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      delFriend(user, friend) {
        this.$Modal.confirm({
          title: '删除',
          content: '你确定要删除' + friend + '?',
          onOk: () => {
            console.log("你点击了确定")
            axios.delete('http://127.0.0.1:8182/set/deleFriend', {params: {'user': user, 'friend': friend}})
              .then(res => {
                if (res.data > 0) {
                  this.$Notice.success({
                    desc: '删除成功'
                  });
                } else {
                  this.$Notice.waring({
                    desc: '删除失败'
                  })
                }
                this.init();
              })
          }
        })
      },
      addFriend() {
        this.modalVisible = true,
          this.form.friend = ""
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true;
            var params = new URLSearchParams();
            params.append('user', this.form.user);
            params.append('friend', this.form.friend);

            axios.post('http://127.0.0.1:8182/set/addFriend', params)
              .then(res => {
                this.submitLoading = false;
                if (res.data > 0) {
                  this.$Notice.success({
                    desc: '添加好友成功'
                  });
                  this.modalVisible = false;
                  this.form.data = "";
                } else {
                  this.$Notice.warning({
                    desc: '已经有该好友'
                  });
                }
                this.init();
              })
          }
        });
      },
      cancel(){
        this.modalVisible = false;
      },

      init() {
        this.resultFrientTitle = "";
        this.getList();
      },
      getList() {
        axios.get('http://127.0.0.1:8182/set/getList')
          .then(res => {
            console.log(res.data.aFriendData)
            this.aFriendData = res.data.aFriend
            this.bFriendData = res.data.bFriend
          })
      },
      intersectFriend() {
        this.resultFrientTitle = '共同好友'
        axios.get('http://127.0.0.1:8182/set/intersectFriend')
          .then(res=>{
            this.resultFrient = res.data;
          })
      },
    },
    created: function () {
      this.init()
    }
  }
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-nav {
    width: 260px;
    margin: 0 auto;
    margin-right: 20px;
    text-align: center;
  }

  .layout-footer-center {
    text-align: center;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 900px;
    margin: 0 auto;
    margin-right: 20px;
  }

</style>
