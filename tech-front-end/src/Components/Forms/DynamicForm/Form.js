import React, {Component} from 'react'
import { connect } from 'react-redux';



class Form extends Component {
    state = {

    }

    onSubmit = e =>{
        e.preventDefault();
        console.log("Inside Form, onSubmit pressed");
        if (this.props.onSubmit) this.props.onSubmit(this.state)
    }

    

    onChange =(e, key) =>{
        this.setState({
            [key]: this[key].value
        })

    }
    //grab the model
    renderForm = () =>{
        let model = this.props.model;
    //loop thorugh all the metadata
        let formUI = model.map((m)=> {
            let key = m.key;
            let type = m.type  || "text"; //default to "text"
            let props = m.props || {};  // default to empty object

            return (
                //create a div
                <div key = {key} className ="form-group">
                {/* form label */}
                    <label className ="form-label"
                        key = {"l" + m.key}
                        htmlFor = {m.key}>
                        {/* label text  */}
                            {m.label}
                        </label>
                        <input {...props}
                        //references every input element in array
                            ref={(key)=>{this[m.key] = key}}
                            className = "form-input"
                            type ={type}
                            key = {"i" + m.key}
                            //event handler
                            onChange={(e)=>{this.onChange(e, key)}}
                        />
                </div> 
            );
        });
        return formUI;
    }

    render(){
        let title = this.props.title || "Default Form"  //Or render "default"
        return (
            <div className = {this.props.className}> 
                <h3>{title}</h3>
                <form className = "dynamic-form" onSubmit={(e)=> {this.onSubmit(e)}}>
                     {this.renderForm()}
                     <div className = "form-group">
                     <button type = "submit">Submit</button>
                     </div>
                </form>
            </div>
        )
    }







}
export default Form;