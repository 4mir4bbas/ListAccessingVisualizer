/*
    Visualizer for List Accessing Algorithms
    Code by: sheback (*Amir Abbas Bakhshipour*)

*/

function MFT(arr, key){
    let newArr = [];
    for (let i=arr.length-1; i>-1; i--){
        if (arr[i] != key){
            newArr.unshift(arr[i]);
        }
    }
    if (newArr.length != arr.length){
        newArr.unshift(key);
    }
    return newArr;
}

function BIT(itemList, bitsList, key){
    let newItemList = [];
    let newBitsList = [];
    let shouldUpdate = false;
    let requestedIndex = -1;
    let keyFound = false;

    for (let i=itemList.length-1; i>-1; i--){
        if (itemList[i] != key){
            newItemList.unshift(itemList[i]);
        }else{
            keyFound = true;
            requestedIndex = i;
            if (bitsList[i] == 0){
                shouldUpdate = true;
            }else{
                newItemList.unshift(itemList[i]);
            }
        }
    }
    if (keyFound){
        if (shouldUpdate){
            newItemList.unshift(key);
            for (let j=bitsList.length-1; j>-1; j--){
                if (j != requestedIndex){
                    newBitsList.unshift(bitsList[j]);
                }
            }
            newBitsList.unshift(1);
        }else{
            for (let j=bitsList.length-1; j>-1; j--){
                if (j != requestedIndex){
                    newBitsList.unshift(bitsList[j]);
                }else{
                    newBitsList.unshift(0);
                }
            }
        }
    }else{
        newBitsList = bitsList;
    }
    return [newItemList, newBitsList];
}

class Visualizer extends React.Component {
    constructor(props){
        super(props);
        let bitsList = []
        for (let i=0; i<10; i++){
            if (Math.random() < 0.5){
                bitsList.push(0);
            }else{
                bitsList.push(1);
            }
        }
        this.state = {
            init: 0,
            inputValue: '',
            submited: '',
            list: [],
            bits: bitsList,
            algorithm: '',
            request: '',
            sentence: '',
            situation: 0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleRequestSubmit = this.handleRequestSubmit.bind(this);
        this.handleRequestChange = this.handleRequestChange.bind(this);
        this.handleNextSubmit = this.handleNextSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        this.setState({
            init: 1,
            submited: this.state.inputValue,
        });
        console.log(this.state.list);
    }

    handleChange(event){
        this.setState({
            inputValue: event.target.value
        });
    }
    handleDropdownChange(event){
        this.setState({
            algorithm: event.target.value
        });
    }

    handleRequestChange(event){
        this.setState({
            request: event.target.value
        });
    }

    handleRequestSubmit(event){
        event.preventDefault();
        // console.log("here"); //debug        
        this.setState({
            sentence: "Looking for requested item in the list...",
            situation: 1
        });
    }

    handleNextSubmit(event){
        event.preventDefault();
        let sit = this.state.situation;
        if (sit == 1){
            let req = parseInt(this.state.request);
            // console.log(this.state.list); //debug
            let idx = this.state.list.indexOf(req);
            if (idx != -1){        
                document.getElementById(`c${idx}`).style.backgroundColor = "red";
                document.getElementById(`b${idx}`).style.backgroundColor = "red";
                this.setState({
                    situation: 2
                });
            }else{
                this.setState({
                    sentence: "Not in the list",
                    situation: 5
                });
            }
        }else if (sit == 2){
            this.setState({
                situation: 3,
                sentence: "Updating if necessary..."
            });
        }else if (sit == 3){
            let req = parseInt(this.state.request);
            let updatedLists = BIT(this.state.list, this.state.bits, req);
            let updatedItemList = updatedLists[0];
            let updatedBitsList = updatedLists[1];
            console.log(updatedItemList); //debug
            console.log(updatedBitsList); //debug
            this.setState({
                list: updatedItemList,
                bits: updatedBitsList,
                situation: 4
            }, function(){
                req = parseInt(this.state.request);
                // console.log(this.state.list); //debug
                let idx = this.state.list.indexOf(req);        
                document.getElementById(`c${idx}`).style.backgroundColor = "red";
                document.getElementById(`b${idx}`).style.backgroundColor = "red";
            });
            
        }else if (sit == 4){

            this.setState({
                situation: 5,
                sentence: "List updated successfully!"
            });
        }else if (sit == 5){
            let req = parseInt(this.state.request);
            // console.log(this.state.list); //debug
            let idx = this.state.list.indexOf(req);
            if (idx != -1){        
                document.getElementById(`c${idx}`).style.backgroundColor = "white";
                document.getElementById(`b${idx}`).style.backgroundColor = "white";
            }
            this.setState({
            situation: 0,
            request: '',
            sentence: ''
            });
        }
    }

    render(){
        if (this.state.init == 0){
            return (
                <div>
                    <InitialForm input={this.state.inputValue} handleChange={this.handleChange} handleSubmit={this.handleSubmit} handleDropdownChange={this.handleDropdownChange} />
                </div>
            );
            
        }
        if (this.state.init == 1){
            const strList = this.state.submited.split(",");
            for (let i=0; i<10; i++){
                this.state.list.push(parseInt(strList[i]));
            this.setState({
                init: 2
                });
            }
        }
        return (
            <div id="visualizer-handler">
                <h1>{this.state.algorithm} Algorithm</h1>
                <ListVisualizer algorithm={this.state.algorithm} list={this.state.list} bits={this.state.bits} />
                <p id="sentence">{this.state.sentence}</p>
                <Handler situation={this.state.situation} request={this.state.request} handleRequestChange={this.handleRequestChange} handleRequestSubmit={this.handleRequestSubmit} handleNextSubmit={this.handleNextSubmit} />
            </div>
        );
    }
}

class InitialForm extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <form onSubmit={this.props.handleSubmit} id="initial-form">
                <label>Choose an algorithm</label>
                    <select name="algorithms" id="algorithms" onChange={this.props.handleDropdownChange}>
                        <option valu="" selected disabled hidden>choose here</option>
                        <option value="MTF">MTF</option>
                        <option value="TRANS">TRANS</option>
                        <option value="FC">FC</option>
                        <option value="TS">TS</option>
                        <option value="BIT">BIT</option>
                    </select>
                <br />
                <label>Enter 10 comma separated integers</label>
                <input onChange={this.props.handleChange} value={this.props.input} placeholder={"ex:1,2,3,4,5,6,7,8,9,10"} autoFocus />
                <br />
                <button type="submit">Initiate</button>
            </form>
        );
    }
}

class ListVisualizer extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div key={this.props.list} id="card-bits-container">
                <div className="card-container">
                    <Card value={"Front"} />
                    <Card index={"c0"} value={this.props.list[0]} />
                    <Card index={"c1"} value={this.props.list[1]} />
                    <Card index={"c2"} value={this.props.list[2]} />
                    <Card index={"c3"} value={this.props.list[3]} />
                    <Card index={"c4"} value={this.props.list[4]} />
                    <Card index={"c5"} value={this.props.list[5]} />
                    <Card index={"c6"} value={this.props.list[6]} />
                    <Card index={"c7"} value={this.props.list[7]} />
                    <Card index={"c8"} value={this.props.list[8]} />
                    <Card index={"c9"} value={this.props.list[9]} />
                    <Card value={"End"} />
                    
                </div>
                <div id="bits-container">
                <Card value={"Bits"} />
                    <Card index={"b0"} value={this.props.bits[0]} />
                    <Card index={"b1"} value={this.props.bits[1]} />
                    <Card index={"b2"} value={this.props.bits[2]} />
                    <Card index={"b3"} value={this.props.bits[3]} />
                    <Card index={"b4"} value={this.props.bits[4]} />
                    <Card index={"b5"} value={this.props.bits[5]} />
                    <Card index={"b6"} value={this.props.bits[6]} />
                    <Card index={"b7"} value={this.props.bits[7]} />
                    <Card index={"b8"} value={this.props.bits[8]} />
                    <Card index={"b9"} value={this.props.bits[9]} />
                    <Card value={""} />
                </div>
            </div>
        );
    }
}

class Handler extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        if (!this.props.situation){
            return (
                    <form onSubmit={this.props.handleRequestSubmit} id="handler-1">
                        <label id="request-label">Request</label>
                        <input id="request-input" value={this.props.request} onChange={this.props.handleRequestChange} autoFocus/>
                        <button id="request-button" type="submit">Access</button>
                    </form>
                    );
        }
        return (
            <form id="handler-2" onSubmit={this.props.handleNextSubmit}>
                <button type="submit" id="next" autoFocus>Next Step</button>
            </form>
        );
    }
}

class Card extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (<div className="card" id={this.props.index}>{this.props.value}</div>);
    }
}

ReactDOM.render(<Visualizer />, document.getElementById("main"));
