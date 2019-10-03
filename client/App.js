import React, { useState } from 'react';
import './App.scss';

const App = () => {
    const [Username, setUsername] = useState('');
    
    return (
        <div>
            <nav>
                <a class="title">Stock App</a>
                <a>Portfolio</a>
                <a>Transactions</a>
                { Username ? <a>{Username}</a> : <a>Sign in / Register</a> }
            </nav>
        </div>
    )
};

export default App;