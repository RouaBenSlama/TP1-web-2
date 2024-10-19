import "./addUser.css"

const AddUser = () => {
    console.log("ADD USER")
    return(
        <div className="addUser">Form
            <form>
                <input 
                    type="text"
                    placeholder="Username"
                    name="username"
                />
                <button>Search</button>
            </form>
            <div className="user">
                <div className="detail">
                    <img src="/avatar.jpg" alt="" />
                    <span>PSYDUCK</span>
                </div>
                <button>Add User</button>
            </div>
        </div>
    )
}

export default AddUser;