import React from "react";
import "./PageAsideTop.css";

export const PageAsideTop: React.FC = () => {
  return (
    <div className="page-aside-container">
      <div className="page-aside-inner">
        <h2 className="page-aside-name">jesie</h2>
        <p className="page-aside-summary">suma</p>

        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">1000</div>
            <div className="stat-label">文章</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1000</div>
            <div className="stat-label">访问</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1000</div>
            <div className="stat-label">订阅</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAsideTop;
