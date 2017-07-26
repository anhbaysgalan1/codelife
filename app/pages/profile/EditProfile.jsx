import axios from "axios";
import React, {Component} from "react";
import {translate} from "react-i18next";
import {connect} from "react-redux";
import {Button, Intent, MenuItem, Position, Toaster} from "@blueprintjs/core";
import {Select} from "@blueprintjs/labs";

/**
 * Class component for a user profile.
 * This is a public page and meant to be shared.
 * If a user is logged in AND this is their profile, show an
 * edit button allowing them to edit it.
 */
const SCHOOLS = [
  {id: "4mg030000", name: "Ee Guia Lopes"},
  {id: "4mg030001", name: "Ee Pero Vaz De Caminha"}
];

class Profile extends Component {

  /**
   * Creates the Profile component with its initial state.
   * @param {boolean} loading - true by defaults gets flipped post AJAX.
   * @param {string} error - Gets set if no username matches username URL param.
   * @param {object} profileUser - Gets set to full user object from DB.
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      profileUser: null,
      schools: []
    };
  }

  /**
   * Grabs username from URL param, makes AJAX call to server and sets error
   * state (if no user is found) or profileUser (if one is).
   */
  componentWillMount() {
    const {username} = this.props.params;
    const {username: loggedInUsername} = this.props.user;

    if (username !== loggedInUsername) {
      this.setState({
        loading: false,
        error: "You don't have permission to edit this user's profile."
      });
      return;
    }

    axios.get("/api/schools/").then(schoolsResp => {
      axios.get(`/api/profile/${username}`).then(resp => {
        const responseData = resp.data;
        if (responseData.error) {
          this.setState({loading: false, error: responseData.error});
        }
        else {
          this.setState({
            loading: false,
            profileUser: responseData,
            schools: schoolsResp.data
          });
        }
      });
  });
  }

  onSimpleUpdate(e) {
    const {profileUser} = this.state;
    profileUser[e.target.id] = e.target.value;
    this.setState({profileUser});
  }

  saveUserInfo(e) {
    e.preventDefault();
    this.setState({loading: true});
    const {profileUser} = this.state;
    console.log("profileUser:\n", profileUser);
    const userPostData = {
      name: profileUser.name,
      bio: profileUser.bio,
      gender: profileUser.gender
    };
    console.log("userPostData:\n", userPostData);
    axios.post("/api/profile/", userPostData).then(resp => {
      const responseData = resp.data;
      if (responseData.error) {
        this.setState({loading: false, error: responseData.error});
      }
      else {
        const t = Toaster.create({className: "saveToast", position: Position.TOP_CENTER});
        t.show({message: "Profile saved!", intent: Intent.SUCCESS});
        this.setState({loading: false, msg: responseData});
      }
    });
  }

  filterSchool(q, school) {
    return `${school.name.toLowerCase()} ${school.id}`.indexOf(q.toLowerCase()) >= 0;
  }

  /**
   * 3 render states:
   * case (loading)
   *  - show loading
   * case (error)
   *  - show error msg from server
   * case (user found)
   *  - user info
   */
  render() {
    const {t} = this.props;
    const {loading, error, profileUser, schools} = this.state;
    const onSimpleUpdate = this.onSimpleUpdate.bind(this);
    const saveUserInfo = this.saveUserInfo.bind(this);

    if (loading) return <h1>Loading ...</h1>;
    if (error) return <h1>{error}</h1>;

    const {name, bio, gender} = profileUser;

    return (
      <div>
        <h1>{t("Edit Profile")}</h1>
        <form>

          <div className="pt-form-group pt-inline">
            <label className="pt-label" htmlFor="example-form-group-input-d">
              {t("Name")}
            </label>
            <div className="pt-form-content">
              <div className="pt-input-group">
                <input onChange={onSimpleUpdate} value={name} id="name" className="pt-input" style={{width: "200px"}} type="text" dir="auto" />
              </div>
            </div>
          </div>

          <div className="pt-form-group pt-inline">
            <label className="pt-label" htmlFor="example-form-group-input-d">
              {t("About Me")}
            </label>
            <div className="pt-form-content">
              <div className="pt-input-group">
                <textarea onChange={onSimpleUpdate} value={bio || ""} id="bio" className="pt-input" dir="auto"></textarea>
              </div>
            </div>
          </div>

          <div className="pt-form-group pt-inline">
            <label className="pt-label" htmlFor="example-form-group-input-d">
              {t("Gender")}
            </label>
            <div className="pt-form-content">
              <div className="pt-select">
                <select onChange={onSimpleUpdate} id="gender" value={gender}>
                  <option value="OTHER">{t("Rather not say")}</option>
                  <option value="FEMALE">{t("Female")}</option>
                  <option value="MALE">{t("Male")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-form-group pt-inline">
            <label className="pt-label" htmlFor="example-form-group-input-d">
              {t("Where are you from?")}
            </label>
            <div className="pt-form-content">
              <div className="pt-select">
                <select>
                  <option selected>Choose an item...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                  <option value="4">Four</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-form-group pt-inline">
            <label className="pt-label" htmlFor="example-form-group-input-d">
              {t("School")}
            </label>
            <div className="pt-form-content">
              <div className="pt-select">
                <select>
                  <option selected>Choose an item...</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                  <option value="4">Four</option>
                </select>
              </div>
            </div>
          </div>

          <Select
            items={SCHOOLS}
            itemRenderer={({item: school}) => {return <MenuItem text={school.name} />}}
            itemPredicate={this.filterSchool}
            noResults={<MenuItem disabled text="No results." />}
          >
            <Button text={SCHOOLS[0].name} rightIconName="double-caret-vertical" />
          </Select>

          <button onClick={saveUserInfo} type="button" className="pt-button">Save</button>

        </form>
      </div>
    );
  }
}

Profile = connect(state => ({
  user: state.auth.user
}))(Profile);

export default translate()(Profile);
