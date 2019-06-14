import React, { Component } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import styles from './index.css';
import logo from '../assets/logo.png';
import { Button, Input, Table, Modal, Radio, Form, Menu, Dropdown } from 'antd';
const pagination = {
  defaultPageSize: 3,
};
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    name: record.name,
  }),
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

// @connect(({ user }) => ({
//   user
// }))

class Home extends Component {
  state = {
    url: 'http://',
    screenshotUrl: '',
    convertWebsiteTitle: '',
    tabledata: [],
    loading: false,
    regModalVisible: false,
    loginModalVisible: false,
    emailLogin: {
      email: '',
      password: '',
    },
    emailReg: {
      email: '',
      password: '',
      repeat_password: '',
      regcode: '',
    },
    viewmode: 0,
    selectedMenu: 'history',
  };
  columns = [
    {
      title: '网站名',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '文件名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '网页地址',
      key: 'url',
      dataIndex: 'url',
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <Button type="link" onClick={this.downloadfile.bind(this, record, index)}>
            下载
          </Button>
          <Button type="link" onClick={this.starFile.bind(this, record, index)}>
            收藏
          </Button>
        </span>
      ),
    },
  ];

  historyColumns = [
    {
      title: '文件名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '网页标题',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '网页地址',
      key: 'url',
      dataIndex: 'url',
    },
    {
      title: '时间',
      key: 'visit_time',
      dataIndex: 'visit_time',
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <a
            href={'http://localhost:7001/public/asketch/' + record.name + '.json'}
            download={record.name + '.json'}
            target="_blank"
          >
            下载
          </a>
        </span>
      ),
    },
  ];

  starColumns = [
    {
      title: '文件名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '网页标题',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '网页地址',
      key: 'url',
      dataIndex: 'url',
    },
    {
      title: '时间',
      key: 'star_time',
      dataIndex: 'star_time',
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <a
            href={'http://localhost:7001/public/asketch/' + record.name + '.json'}
            download={record.name + '.json'}
            target="_blank"
          >
            下载
          </a>
        </span>
      ),
    },
  ];

  handleView = mode => {
    this.setState({
      viewmode: mode,
    });
  };
  downloadfile = (record, index) => {
    console.log(record, index);
    const a = document.createElement('a');
    a.href = 'http://localhost:7001/public/asketch/' + record.name;
    a.download = record.name;
    a.click();
  };
  starFile = (record, index) => {
    this.props.dispatch({
      type: 'user/starfile',
      payload: { record },
    });
  };
  handleUrlChange = e => {
    // console.log(e.target.value);
    this.setState({
      url: e.target.value,
    });
  };
  handleRegModalVisible = () => {
    this.setState({
      regModalVisible: true,
    });
  };
  handleLoginModalVisible = () => {
    this.setState({
      loginModalVisible: true,
    });
  };
  handleEmailRegister = () => {
    this.props.dispatch({
      type: 'user/register',
      payload: this.state.emailReg,
    });
    this.setState({
      regModalVisible: false,
    });
  };
  handleEmailLogin = async e => {
    e.preventDefault();
    // login
    const emailLoginInfo = this.state.emailLogin;
    await this.props.dispatch({ type: 'user/login', payload: { emailLoginInfo } });
    this.setState({
      loginModalVisible: false,
    });
  };
  transfer = async () => {
    const { url } = this.state;
    let islogin, email;
    islogin = this.props.user.isLogin;
    if (islogin) {
      email = this.props.user.userinfo.email;
    }
    this.setState({
      loading: true,
    });
    const that = this;
    console.log('【待转换网址】', url);
    await axios
      .post('http://localhost:7001/gosketch/getfile', {
        url,
        islogin,
        email,
      })
      .then(res => {
        console.log(res);
        const newfile = {
          key: (that.state.tabledata.length + 1).toString(),
          name: res.data.asketchfile,
          url: res.data.websiteUrl,
          title: res.data.websiteTitle,
          isStar:false
        };
        const newdata = [newfile, ...that.state.tabledata];
        that.setState({
          screenshotUrl: res.data.screenshot,
          titleboxStatus: false,
          convertWebsiteTitle: res.data.websiteTitle,
          tabledata: newdata,
          loading: false,
        });
      });
  };
  handleLogin_email_change = e => {
    const email = e.target.value;
    const newInfo = {
      email,
      password: this.state.emailLogin.password,
    };
    this.setState({
      emailLogin: newInfo,
    });
  };
  handleLogin_password_change = e => {
    const pw = e.target.value;
    const newInfo = {
      email: this.state.emailLogin.email,
      password: pw,
    };
    this.setState({
      emailLogin: newInfo,
    });
  };
  sendRegcode = () => {
    const { email } = this.state.emailReg;
    this.props.dispatch({
      type: 'user/regmail',
      payload: { email },
    });
  };
  handleReg_email_change = e => {
    let emailReg = { ...this.state.emailReg };
    emailReg.email = e.target.value;
    this.setState({
      emailReg,
    });
  };
  handleReg_regcode_change = e => {
    let emailReg = { ...this.state.emailReg };
    emailReg.regcode = e.target.value;
    this.setState({
      emailReg,
    });
  };
  handleReg_pw_change = e => {
    let emailReg = { ...this.state.emailReg };
    emailReg.password = e.target.value;
    this.setState({
      emailReg,
    });
  };
  handleReg_rpw_change = e => {
    let emailReg = { ...this.state.emailReg };
    emailReg.repeat_password = e.target.value;
    this.setState({
      emailReg,
    });
  };
  handleMenuClick = e => {
    this.setState({
      selectedMenu: e.key,
    });
  };
  render() {
    const {
      url,
      screenshotUrl,
      tabledata,
      regModalVisible,
      loginModalVisible,
      viewmode,
    } = this.state;
    const { isLogin, userinfo, history, star } = this.props.user;

    return (
      <div className={styles.backgroudbox}>
        <Modal visible={loginModalVisible} closable={false} footer={null}>
          <div>
            <Form onSubmit={this.handleEmailLogin} {...formItemLayout}>
              <Form.Item label="账号：">
                <Input placeholder="邮箱账号" onChange={this.handleLogin_email_change} />
              </Form.Item>
              <Form.Item label="密码：">
                <Input
                  placeholder="6-16位密码，区分大小写"
                  onChange={this.handleLogin_password_change}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  登陆
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal visible={regModalVisible} closable={false} footer={null}>
          <div>
            <Radio.Group defaultValue="email" buttonStyle="solid">
              <Radio.Button value="email">邮箱注册</Radio.Button>
              {/* <Radio.Button value="phone">手机注册</Radio.Button> */}
            </Radio.Group>
            <div>
              {/* 已有账号？去<span onClick={this.setState({ loginModalVisible: true })}>登陆</span> */}
            </div>
            <Form {...formItemLayout}>
              <Form.Item label="账号：">
                <Input placeholder="邮箱账号" onChange={this.handleReg_email_change} />
              </Form.Item>
              <Form.Item label="邮箱验证：">
                <Input placeholder="验证码" onChange={this.handleReg_regcode_change} />
                <Button type="primary" onClick={this.sendRegcode}>
                  发送验证码
                </Button>
              </Form.Item>
              <Form.Item label="密码：">
                <Input placeholder="6-16位密码，区分大小写" onChange={this.handleReg_pw_change} />
              </Form.Item>
              <Form.Item label="确认密码：">
                <Input placeholder="再次输入密码" onChange={this.handleReg_rpw_change} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.handleEmailRegister}>
                  注册
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <div className={styles.headerbox}>
          <div className={styles.logobox}>
            <img src={logo} alt="logo" />
          </div>
          <div className={styles.loginbox}>
            {viewmode === 1 && (
              <div className={styles.login_text}>
                <span onClick={() => this.handleView(0)}>返回转换首页</span>
              </div>
            )}
            {!viewmode &&
              (!isLogin ? (
                <div className={styles.login_text}>
                  <span onClick={this.handleLoginModalVisible}>登陆</span> |{' '}
                  <span onClick={this.handleRegModalVisible}>注册</span>
                </div>
              ) : (
                <Dropdown
                  overlay={() => (
                    <Menu>
                      <Menu.Item>
                        <a onClick={() => this.handleView(1)}>个人中心</a>
                      </Menu.Item>
                    </Menu>
                  )}
                  placement="bottomLeft"
                >
                  <div className={styles.login_text}>
                    <span>{userinfo.email}</span>
                  </div>
                </Dropdown>
              ))}
          </div>
        </div>
        {viewmode ? (
          <div className={styles.content2}>
            <Menu
              mode="horizontal"
              onClick={this.handleMenuClick}
              selectedKeys={[this.state.selectedMenu]}
            >
              <Menu.Item key="history">历史记录</Menu.Item>
              <Menu.Item key="star">收藏夹</Menu.Item>
            </Menu>
            <div className={styles.mydatatable}>
              {this.state.selectedMenu === 'history' ? (
                <Table
                  rowSelection={rowSelection}
                  columns={this.historyColumns}
                  dataSource={history}
                  pagination={10}
                  bordered={true}
                  size="small"
                />
              ) : (
                <Table
                  rowSelection={rowSelection}
                  columns={this.starColumns}
                  dataSource={star}
                  pagination={10}
                  bordered={true}
                  size="small"
                />
              )}
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.titlebox}>
              <div className={styles.maintitle}>GoSketch</div>
              <div className={styles.subtitle}>
                GoSketch是一款将网页转为sketch文件的工具，帮助设计师快速获得心仪的网页设计文件
              </div>
            </div>
            <div className={styles.handlebox}>
              <div className={styles.handleLR}>
                <Input
                  placeholder="https://"
                  value={url}
                  allowClear
                  size="large"
                  onChange={this.handleUrlChange}
                />
                <div className={styles.handleBtn} onClick={this.transfer}>
                  转换
                </div>
              </div>
            </div>
            <div className={styles.showbox}>
              <div className={styles.tablebox}>
                <Table
                  rowSelection={rowSelection}
                  columns={this.columns}
                  dataSource={tabledata}
                  pagination={pagination}
                  bordered={true}
                  size="small"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { user: state.user };
};
export default connect(mapStateToProps)(Home);
