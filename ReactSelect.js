/**
 * Created by Lever on 16/5/17.
 */
const React = require('react');
const Component = React.Component;
import { render } from 'react-dom';
var $ = require("jquery");
/**
 * defaultSelect --> 默认选项
 * selectList --> 选项列表
 * curSelect --> 当前选中
 */


export class ReactSelect extends Component{
    constructor(props){
        super(props); //新建父类的构造对象
        this.state = {
            curSelect: props.defaultSelect || props.selectList[0],
            displayMenu: false
        };
    }
    changeCurSelect(target,index){
        //数据没有改变,则不执行任何操作
        if(target === this.state.curSelect){
            return;
        }
        this.setState({
            curSelect: target
        });
        if(!!this.props.keyType){
            switch(this.props.keyType){
                case "arrayIndex":
                    this.props.callback && this.props.callback(index);
                    break;
            }
            return;
        }
        this.props.callback && this.props.callback(target);
    }
    compileLiFromArray(){
        if(this.props.disabled){
            return;
        }
        let list;
        let selectList = this.props.selectList;
        let i = 0;//用来充当key值
        list = selectList.map(function (item, index) {
            return (
                //必须添加key属性,React在动态渲染子级时,key可以用来唯一确定子级的状态
                <li key={index} onClick={ () => this.changeCurSelect(item,index) }><span>{item}</span></li>
            )
        }.bind(this));
        return list;
    }
    showSelectList(){
        if(this.props.disabled){
            return;
        }
        this.setState({
            displayMenu: !this.state.displayMenu
        });
    }
    showMenu(event){
        if(event.target.className.indexOf('react-click') === -1){
            $(".dropdown-menu").removeClass('show').addClass("hide");
        }
    }
    componentDidMount(){
        document.addEventListener('click', this.showMenu);
    }
    componentWillUnmount(){
        document.removeEventListener('click', this.showMenu);
    }
    componentWillReceiveProps(nextProps){
        //由于state更新延迟,无法及时获得父组件state的变化,这里先通过参数判断用户是否希望我们更新状态,然后判断数据是否有变化,再手动去更新选中项
        if(this.props.willReceive){
            if(nextProps.selectList !== this.props.selectList){
                this.setState({
                    curSelect: nextProps.selectList[0]
                });
            }
        }
    }
    render(){
        return (
            <div className="react-select react-click">
                <div className="btn-group react-click" onClick={ () => this.showSelectList()}>
                    <div className="react-click"><span className="default-select react-click">{this.state.curSelect}</span><i className="caret react-click"></i></div>
                    <ul className={"react-click dropdown-menu " + (this.state.displayMenu ? 'show' : 'hide')}>
                        {this.compileLiFromArray()}
                    </ul>
                </div>
            </div>
        )
    }
}