import React, { Component } from 'react';

class TeamsDropDown extends Component {

    render() {
        const { teamsData, handleChange, idProp } = this.props;

        return (
            <div className="form-group">
            <select className="form-control" id={idProp} onChange={handleChange} >
                <option value="" disabled selected>Select team</option>
                {
                    teamsData.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                }
            </select>
            </div>
        );
    }
}

export default TeamsDropDown;