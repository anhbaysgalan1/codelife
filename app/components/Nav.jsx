import React, {Component} from "react";
import {translate} from "react-i18next";
import {Link} from "react-router";
import {connect} from "react-redux";
import Browser from "components/Browser";
import Search from "components/Search";
import AuthForm from "components/AuthForm";

import "./Nav.css";

import {Popover, PopoverInteractionKind, Position, Dialog} from "@blueprintjs/core";

// Nav Component
// Contains a list of links in Footer format, inserted at the bottom of each page

class Nav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showBrowser: false,
      isLoginOpen: false
    };
  }

  /*
  This progress reloader is not robust. Ideally, userprogress should be loaded once ever, live in redux state,
  and update each time the user beats a level in parallel with updating the underlying database. However, to
  avoid a refactor, the following code manually reaches into the Browser component and reloads userprogress
  on each open/close of the panel.  TODO: revisit this
  */
  toggleBrowser() {
    this.setState({showBrowser: !this.state.showBrowser});
    if (this.browser) this.browser.getWrappedInstance().getWrappedInstance().reloadProgress();
  }

  reportClick() {
    this.setState({showBrowser: false});
  }

  authForm(mode) {
    this.setState({formMode: mode, isLoginOpen: !this.state.isLoginOpen});
  }

  render() {
    const {auth, currentPath, logo, linkObj, serverLocation, t} = this.props;
    const {isLoginOpen} = this.state;
    const {protocol, host} = serverLocation;
    const hostSansSub = host.replace("pt.", "").replace("en.", "").replace("www.", "");

    // language select links
    const languageLinks = [
      {id: 1, title: "English", shortTitle: "En", link: `${protocol}//en.${hostSansSub}${currentPath}`},
      {id: 2, title: "Portuguese", shortTitle: "Pt", link: `${protocol}//pt.${hostSansSub}${currentPath}`}
    ];

    return (
      <div className="nav" id="nav">

        {/* logo */}
        <div className="logo">
          <Link className={logo ? "logo-link" : "logo-link is-huge"} to={"/"}>
            <span className="logo-tag font-xs">Beta</span>
            <img className="logo-text" src="/logo/logo-sm.png" alt="Codelife" />
          </Link>
        </div>

        {/* site-wide search */}
        { auth.user ? <Search linkObj={linkObj} scope="sitewide" /> : null }

        { auth.user
          ? <div className="link-list font-sm">
            <Link className="link with-toggle" to="/island">
              <span className="link-icon pt-icon-standard pt-icon-map" />
              <span className="link-text u-hide-below-sm">{ t("Map") }</span>
            </Link>
            <Popover
              interactionKind={PopoverInteractionKind.CLICK}
              className="link-toggle-container"
              popoverClassName="pt-popover-content-sizing browser-popover"
              position={Position.BOTTOM}
            >
              <button className="link-toggle-button u-unbutton" onClick={this.toggleBrowser.bind(this)} >
                <span className="toggle-icon pt-icon-standard pt-icon-chevron-down"></span>
              </button>
              <div className="dropdown-list browser-list" id="browser">
                <Browser ref={b => this.browser = b} linkObj={linkObj} reportClick={this.reportClick.bind(this)}/>
              </div>
            </Popover>

            {/* my projects */}
            <Link className="link projects-link" to={`/projects/${auth.user.username}`}>
              <span className="link-icon pt-icon-standard pt-icon-applications" />
              <span className="link-text u-hide-below-sm">{ t("My projects") }</span>
            </Link>

            {/* account */}
            <Link className="link with-toggle" to={ `/profile/${ auth.user.username }` }>
              <span className="link-icon pt-icon-standard pt-icon-user" />
              <span className="link-text u-hide-below-sm">{ auth.user.username }</span>
            </Link>
            {/* dropdown */}
            <Popover
              interactionKind={PopoverInteractionKind.CLICK}
              className="link-toggle-container"
              popoverClassName="pt-popover-content-sizing account-popover"
              position={Position.BOTTOM}
            >
              {/* dropdown button */}
              <button className="link-toggle-button u-unbutton" onClick={this.toggleBrowser.bind(this)} >
                <span className="toggle-icon pt-icon-standard pt-icon-chevron-down"></span>
              </button>

              {/* dropdown links */}
              <div className="link-dropdown">
                {/* my profile */}
                <Link className="link font-sm" to={ `/profile/${ auth.user.username }` }>
                  <span className="link-icon pt-icon-standard pt-icon-id-number" />
                  { t("My profile") }
                </Link>
                {/* my projects */}
                <Link className="link font-sm" to={`/projects/${auth.user.username}`}>
                  <span className="link-icon pt-icon-standard pt-icon-applications" />
                  <span className="link-text u-hide-below-sm">{ t("My projects") }</span>
                </Link>
                {/* admin link */}
                { auth.user.role > 0 ? <Link className="link font-sm" to="/admin">
                  <span className="link-icon pt-icon-standard pt-icon-series-configuration" />
                  { t("Admin") }
                </Link> : null }
                {/* log out */}
                <a className="link font-sm" href="/auth/logout">
                  <span className="link-icon pt-icon-standard pt-icon-log-out" />
                  { t("Log out") }
                </a>
              </div>
            </Popover>

            {/* language select */}
            <span className="link language-icon-container">
              <span className="link-icon pt-icon-standard pt-icon-globe" />
            </span>
            <a className="link language-link" key={languageLinks[0].id} href={languageLinks[0].link}>
              {languageLinks[0].shortTitle}
            </a>
            <a className="link language-link" key={languageLinks[1].id} href={languageLinks[1].link}>{languageLinks[1].shortTitle}</a>
          </div>
          : <div className="link-list font-sm">

            {/* login | signup */}
            <button className="link login-link u-unbutton" onClick={this.authForm.bind(this, "login")}>
              <span className="link-icon pt-icon-standard pt-icon-log-in" />
              <span className="link-text u-hide-below-sm">{ t("LogIn.Log_in") }</span>
            </button>
            <button className="link signup-link u-unbutton" onClick={this.authForm.bind(this, "signup")}>
              <span className="link-icon pt-icon-standard pt-icon-new-person" />
              <span className="link-text u-hide-below-sm">{ t("SignUp.Sign Up") }</span>
            </button>

            {/* about */}
            <Link className="link" to="/about">
              <span className="link-icon pt-icon-standard pt-icon-help" />
              <span className="link-text u-hide-below-sm">{ t("About") }</span>
            </Link>

            {/* language select */}
            <a className="link language-link" key={languageLinks[0].id} href={languageLinks[0].link}>
              <span className="link-icon pt-icon-standard pt-icon-globe" />
              {languageLinks[0].title}
            </a>
            <a className="link language-link" key={languageLinks[1].id} href={languageLinks[1].link}>{languageLinks[1].title}</a>
          </div> }
        <Dialog
          className="form-container"
          iconName="inbox"
          isOpen={isLoginOpen}
          onClose={this.authForm.bind(this)}
          title="Dialog header"
        >
          <AuthForm initialMode={this.state.formMode} />
        </Dialog>
      </div>
    );
  }
}

Nav.defaultProps = {
  logo: true
};

Nav = connect(state => ({
  auth: state.auth,
  serverLocation: state.location
}))(Nav);
Nav = translate()(Nav);
export default Nav;
