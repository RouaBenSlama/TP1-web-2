import React from "react";
import "./details.css"

const Details = () => {
    return (
        <div className="details">
            <div className="user">
                <img src="/avatar.jpg" alt="" />
                <h2>Pochaco</h2>
                <p>Hi my name is pochaco from ....</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat settings</span>
                        <img src="/arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="/arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Share photos</span>
                        <img src="/arrowDown.png" alt="" />
                    </div>
                    <div className="photo">
                        <div className="photoItems">
                            <div className="photoDetail">
                                <img src="https://pyxis.nymag.com/v1/imgs/df1/bdf/5c012eec9eef195ccdc36e79fc1da9e344-anime-lede.rsquare.w400.jpg" alt="" />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="/dowload.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItems">
                            <div className="photoDetail">
                                <img src="https://pyxis.nymag.com/v1/imgs/df1/bdf/5c012eec9eef195ccdc36e79fc1da9e344-anime-lede.rsquare.w400.jpg" alt="" />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="/dowload.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItems">
                            <div className="photoDetail">
                                <img src="https://pyxis.nymag.com/v1/imgs/df1/bdf/5c012eec9eef195ccdc36e79fc1da9e344-anime-lede.rsquare.w400.jpg" alt="" />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="/dowload.png" alt="" className="icon"/>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="/arrowUp.png" alt="" />
                    </div>
                </div>
            </div>
            <button>Block User</button>
            <br />
            <br />
            <button className="logout">Logout</button>
        </div>
    );
};

export default Details;

