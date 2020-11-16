import React from 'react'

import Phone from './components/Phone'

const App = () => {
    const [open, setOpen] = React.useState(false)
    return (
        <div>
            {/* <button onClick={() => setOpen(!open)}>Open Camera</button> */}
            <Phone />
        </div>
    )
}

export default App;