import PropTypes from "prop-types";
import React from 'react';

class Opinion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            overall_opinion: this.props.rating,
        }
    }
    render() {
        const { overall_opinion } = this.state
        return (
            <React.Fragment>
                <div className="opinion-option-list">
                    {overall_opinion == 1 && <div><div className={`openion-icon active me-0`} id={"opinion-1"}><i className="bx bxs-no-entry"></i></div> <p className="mt-2 mb-0 text-center">Not Fit</p></div>}
                    {overall_opinion == 2 && <div><div className={`openion-icon active me-0`} id={"opinion-2"}><i className="bx bxs-dislike"></i></div><p className="mt-2 mb-0 text-center">Not Good</p></div>}
                    {overall_opinion == 3 && <div><div className={`openion-icon active me-0`} id={"opinion-3"}><i className="bx bxs-meh"></i></div><p className="mt-2 mb-0 text-center">Not Sure</p></div>}
                    {overall_opinion == 4 && <div><div className={`openion-icon active me-0`} id={"opinion-4"}><i className="bx bxs-like"></i></div><p className="mt-2 mb-0 text-center">Good</p></div>}
                    {overall_opinion == 5 && <div><div className={`openion-icon active me-0`} id={"opinion-5"}><i className="bx bxs-chevron-down-square"></i></div><p className="mt-2 mb-0 text-center">Must Hire</p></div>}
                </div>
            </React.Fragment>
        );
    }
}
Opinion.propTypes = {
    rating: PropTypes.any
}
export default Opinion