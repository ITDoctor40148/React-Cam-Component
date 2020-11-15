import React from 'react'

import Phone from './components/Phone'
import NewQuarkCamera from './components/NewQuarkCamera'

const App = () => {
    const [open, setOpen] = React.useState(false)
    return (
        <div>
            {/* <button onClick={() => setOpen(!open)}>Open Camera</button> */}
            <Phone />
            <NewQuarkCamera />
        </div>
    )
}

export default App;