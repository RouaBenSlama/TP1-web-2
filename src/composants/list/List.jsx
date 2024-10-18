import React, { useState } from "react";
import "./list.css"

const List = () => {
    const [addUser, setAddUser] = useState(false)
    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt="loupe" />
                    <input type="text"className="input" placeholder="Search"/>
                </div>
                <img 
                    src={ addUser ? "/minus.png" : "/plus.png"} 
                    alt="addIcon" 
                    className="add"
                    onClick={() => setAddUser ((prev) => !prev)}

                />

            </div>
            <div className="item">
                <img src="/avatar.jpg" alt="profilPic" />
                <div className="texts">
                    <span>John Doe</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="/avatar.jpg" alt="profilPic" />
                <div className="texts">
                    <span>John Doe</span>
                    <p>Hello</p>
                </div>
            </div>
            <div className="item">
                <img src="/avatar.jpg" alt="profilPic" />
                <div className="texts">
                    <span>John Doe</span>
                    <p>Hello</p>
                </div>
            </div>
        </div>
    );
};

export default List;

