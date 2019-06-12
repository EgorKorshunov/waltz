
const btnMinus = {view:"button",value:"-", width: 20, click(){ this.getFormView()._write_minus()}};
const btnPlus = {view:"button",value:"+", width: 20, click(){ this.getFormView()._write_plus()}};
const btnWrite = {view:"button", maxWidth:120, value:"Write",click(){this.getFormView()._write() }};

export const scalar_input = webix.protoUI({
    name:"scalar_input",
    getValue(){
        const value = this.elements.value.getValue();
        switch(this.config.attr.info.data_type){
            case "DevShort":
            case "DevUShort":
            case "DevLong":
            case "DevULong":
            case "DevLong64":
            case "DevULong64":
                return parseInt(value);
            case "DevDouble":
            case "DevFloat":
                return parseFloat(value);
            case "DevString":
            case "DevChar":
            case "DevUChar":
            default:
                return value;
        }
    },
    setValue(value){
        this.elements.value.setValue(value);
    },
    _write_minus(){
        if(!this.validate()) return;
        const delta = this.getValue();
        this.config.attr.read().then(resp => {
            UserAction.writeAttribute(this.config.attr,resp.value - delta)
                .then(()=>{
                    this.getTopParentView().run();
                });
        })
    },
    _write_plus(){
        if(!this.validate()) return;
        const delta = this.getValue();
        this.config.attr.read().then(resp => {
            UserAction.writeAttribute(this.config.attr,resp.value + delta)
                .then(()=>{
                    this.getTopParentView().run();
                });
        })
    },
    _write(){
        if(!this.validate()) return;
        UserAction.writeAttribute(this.config.attr,this.getValues().value)
            .then(()=>{
                this.getTopParentView().run();
            });
    },
    _compact_view(attr){
        const cols = [
            {view:"text", name:"value", placeholder: `Input: ${attr.info.data_type} [min:${attr.info.min_value};max:${attr.info.max_value}]`, gravity:2}
        ];

        if(attr.info.data_format === "SCALAR")
            cols.push(btnMinus, btnPlus);

        cols.push(btnWrite);

        return {
            cols
        }
    },
    _normal_view(attr){
        const cols = [
            {}
        ];

        if(attr.info.data_format === "SCALAR")
            cols.push(
                webix.extend(btnMinus,{tooltip:"Hotkey: Ctrl + numpad(-)", hotkey: "ctrl+109"}),
                webix.extend(btnPlus, {tooltip:"Hotkey: Ctrl + numpad(+)", hotkey: "ctrl+107"}));

        cols.push(
            webix.extend(btnWrite,{tooltip:"Hotkey: Ctrl + Enter", hotkey: "ctrl+enter"}));

        return {
            elements:[
                {view:"text", name:"value", label:`Input: ${attr.info.data_type} [min:${attr.info.min_value};max:${attr.info.max_value}]`, labelPosition: "top", placeholder: attr.info.format, tooltip:attr.info.description, validate:webix.rules.isNotEmpty},
                {
                    cols
                }
            ]
        }
    },
    _config(config){
        let body;
        if(config.type && config.type === "compact"){
            body = this._compact_view(config.attr)
        } else {
            body = this._normal_view(config.attr)
        }
        return body;
    },
    $init(config){
        webix.extend(config, this._config(config));
    }

}, webix.IdSpace,webix.ui.form);