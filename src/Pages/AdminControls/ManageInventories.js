import React, { useState } from "react";
import ManageCategories from "./ManageCategories";
import ManageManufacturers from "./ManageManufacturers";

const ManageInventories = ({ userEmail, authIdToken }) => {
    const [mode, setMode] = useState('categories'); // Initial mode is 'categories'

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-3">
                    <div className="d-flex flex-column">
                        <button
                            onClick={() => setMode('categories')}
                            className={`btn btn-${mode === 'categories' ? 'primary' : 'secondary'} mb-2`}
                        >
                            Show Categories
                        </button>
                        <button
                            onClick={() => setMode('manufacturers')}
                            className={`btn btn-${mode === 'manufacturers' ? 'primary' : 'secondary'}`}
                        >
                            Show Manufacturers
                        </button>
                    </div>
                </div>
                <div className="col-md-9">
                    {mode === 'categories' && <ManageCategories userEmail={userEmail} authIdToken={authIdToken} />}
                    {mode === 'manufacturers' && <ManageManufacturers userEmail={userEmail} authIdToken={authIdToken} />}
                </div>
            </div>
        </div>
    );
};

export default ManageInventories;
