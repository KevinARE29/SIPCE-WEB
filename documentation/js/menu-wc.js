'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">sipce-web documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AcademicCatalogsModule.html" data-type="entity-link">AcademicCatalogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AcademicCatalogsModule-83bd5a7d544fd2ce6cca46b823f97bd9"' : 'data-target="#xs-components-links-module-AcademicCatalogsModule-83bd5a7d544fd2ce6cca46b823f97bd9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AcademicCatalogsModule-83bd5a7d544fd2ce6cca46b823f97bd9"' :
                                            'id="xs-components-links-module-AcademicCatalogsModule-83bd5a7d544fd2ce6cca46b823f97bd9"' }>
                                            <li class="link">
                                                <a href="components/ShowCyclesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShowCyclesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShowGradesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShowGradesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShowPeriodsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShowPeriodsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShowSectionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShowSectionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShowShiftComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShowShiftComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AcademicCatalogsRoutingModule.html" data-type="entity-link">AcademicCatalogsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AntDesignModule.html" data-type="entity-link">AntDesignModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-1939e94587f5094b29381f1684d53f0b"' : 'data-target="#xs-components-links-module-AppModule-1939e94587f5094b29381f1684d53f0b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-1939e94587f5094b29381f1684d53f0b"' :
                                            'id="xs-components-links-module-AppModule-1939e94587f5094b29381f1684d53f0b"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainNavComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainNavComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link">AuthRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IconsProviderModule.html" data-type="entity-link">IconsProviderModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InterceptorModule.html" data-type="entity-link">InterceptorModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-InterceptorModule-6697c858355b485bb00a5b71fee16766"' : 'data-target="#xs-injectables-links-module-InterceptorModule-6697c858355b485bb00a5b71fee16766"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InterceptorModule-6697c858355b485bb00a5b71fee16766"' :
                                        'id="xs-injectables-links-module-InterceptorModule-6697c858355b485bb00a5b71fee16766"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginModule.html" data-type="entity-link">LoginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' : 'data-target="#xs-components-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' :
                                            'id="xs-components-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnauthorizedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UnauthorizedComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' : 'data-target="#xs-injectables-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' :
                                        'id="xs-injectables-links-module-LoginModule-a95c399cac79c74477a761b358534cc5"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LogsModule.html" data-type="entity-link">LogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LogsModule-a0b06fe338ec06e552f8c069305f6979"' : 'data-target="#xs-components-links-module-LogsModule-a0b06fe338ec06e552f8c069305f6979"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LogsModule-a0b06fe338ec06e552f8c069305f6979"' :
                                            'id="xs-components-links-module-LogsModule-a0b06fe338ec06e552f8c069305f6979"' }>
                                            <li class="link">
                                                <a href="components/AccessLogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccessLogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ActionsLogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActionsLogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogsRootComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogsRootComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LogsRoutingModule.html" data-type="entity-link">LogsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PasswordRoutingModule.html" data-type="entity-link">PasswordRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ResetPasswordModule.html" data-type="entity-link">ResetPasswordModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ResetPasswordModule-6e298e03e52e28e79461f4602ce32b52"' : 'data-target="#xs-components-links-module-ResetPasswordModule-6e298e03e52e28e79461f4602ce32b52"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ResetPasswordModule-6e298e03e52e28e79461f4602ce32b52"' :
                                            'id="xs-components-links-module-ResetPasswordModule-6e298e03e52e28e79461f4602ce32b52"' }>
                                            <li class="link">
                                                <a href="components/ResetPasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResetPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPswComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResetPswComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdatePasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UpdatePasswordComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RolesModule.html" data-type="entity-link">RolesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RolesModule-ae41290337dc953f3e5ce38f7ad80925"' : 'data-target="#xs-components-links-module-RolesModule-ae41290337dc953f3e5ce38f7ad80925"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RolesModule-ae41290337dc953f3e5ce38f7ad80925"' :
                                            'id="xs-components-links-module-RolesModule-ae41290337dc953f3e5ce38f7ad80925"' }>
                                            <li class="link">
                                                <a href="components/RoleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RoleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RolesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RolesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RolesRoutingModule.html" data-type="entity-link">RolesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SchoolYearModule.html" data-type="entity-link">SchoolYearModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SchoolYearModule-6af8185b9bfd8dd23d8060a120a9da84"' : 'data-target="#xs-components-links-module-SchoolYearModule-6af8185b9bfd8dd23d8060a120a9da84"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SchoolYearModule-6af8185b9bfd8dd23d8060a120a9da84"' :
                                            'id="xs-components-links-module-SchoolYearModule-6af8185b9bfd8dd23d8060a120a9da84"' }>
                                            <li class="link">
                                                <a href="components/AcademicAssignmentsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AcademicAssignmentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CounselorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CounselorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CycleCoordinatorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CycleCoordinatorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeadTeachersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeadTeachersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewSchoolYearSummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewSchoolYearSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchoolYearComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchoolYearComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchoolYearEndSummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SchoolYearEndSummaryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SchoolYearRoutingModule.html" data-type="entity-link">SchoolYearRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SecurityPoliciesModule.html" data-type="entity-link">SecurityPoliciesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SecurityPoliciesModule-23dfaae56d14f68f35c2194ad45bd7ac"' : 'data-target="#xs-components-links-module-SecurityPoliciesModule-23dfaae56d14f68f35c2194ad45bd7ac"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SecurityPoliciesModule-23dfaae56d14f68f35c2194ad45bd7ac"' :
                                            'id="xs-components-links-module-SecurityPoliciesModule-23dfaae56d14f68f35c2194ad45bd7ac"' }>
                                            <li class="link">
                                                <a href="components/SecurityPoliciesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SecurityPoliciesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SecurityPoliciesRoutingModule.html" data-type="entity-link">SecurityPoliciesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StudentsModule.html" data-type="entity-link">StudentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StudentsModule-f7ca8d1523596682e2ba2150fff87062"' : 'data-target="#xs-components-links-module-StudentsModule-f7ca8d1523596682e2ba2150fff87062"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StudentsModule-f7ca8d1523596682e2ba2150fff87062"' :
                                            'id="xs-components-links-module-StudentsModule-f7ca8d1523596682e2ba2150fff87062"' }>
                                            <li class="link">
                                                <a href="components/NewStudentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewStudentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StudentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StudentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StudentsAssignmentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StudentsAssignmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StudentsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StudentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateStudentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UpdateStudentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UploadStudentsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UploadStudentsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StudentsRoutingModule.html" data-type="entity-link">StudentsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UsersModule-1927e143f3c0d23db9d99be569f5fe0d"' : 'data-target="#xs-components-links-module-UsersModule-1927e143f3c0d23db9d99be569f5fe0d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersModule-1927e143f3c0d23db9d99be569f5fe0d"' :
                                            'id="xs-components-links-module-UsersModule-1927e143f3c0d23db9d99be569f5fe0d"' }>
                                            <li class="link">
                                                <a href="components/UnauthenticatedUsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UnauthenticatedUsersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UploadUsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UploadUsersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersRoutingModule.html" data-type="entity-link">UsersRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WelcomeModule.html" data-type="entity-link">WelcomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WelcomeModule-2921a2e8d24b8d44503588c730e08758"' : 'data-target="#xs-components-links-module-WelcomeModule-2921a2e8d24b8d44503588c730e08758"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WelcomeModule-2921a2e8d24b8d44503588c730e08758"' :
                                            'id="xs-components-links-module-WelcomeModule-2921a2e8d24b8d44503588c730e08758"' }>
                                            <li class="link">
                                                <a href="components/WelcomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WelcomeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/WelcomeRoutingModule.html" data-type="entity-link">WelcomeRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ForbiddenComponent.html" data-type="entity-link">ForbiddenComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link">NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ServerErrorComponent.html" data-type="entity-link">ServerErrorComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccessLog.html" data-type="entity-link">AccessLog</a>
                            </li>
                            <li class="link">
                                <a href="classes/ActionLog.html" data-type="entity-link">ActionLog</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPermission.html" data-type="entity-link">AppPermission</a>
                            </li>
                            <li class="link">
                                <a href="classes/Catalogs.html" data-type="entity-link">Catalogs</a>
                            </li>
                            <li class="link">
                                <a href="classes/Catalogue.html" data-type="entity-link">Catalogue</a>
                            </li>
                            <li class="link">
                                <a href="classes/Cycle.html" data-type="entity-link">Cycle</a>
                            </li>
                            <li class="link">
                                <a href="classes/Grade.html" data-type="entity-link">Grade</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pagination.html" data-type="entity-link">Pagination</a>
                            </li>
                            <li class="link">
                                <a href="classes/Permission.html" data-type="entity-link">Permission</a>
                            </li>
                            <li class="link">
                                <a href="classes/Responsible.html" data-type="entity-link">Responsible</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link">Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/SchoolYear.html" data-type="entity-link">SchoolYear</a>
                            </li>
                            <li class="link">
                                <a href="classes/Section.html" data-type="entity-link">Section</a>
                            </li>
                            <li class="link">
                                <a href="classes/Section-1.html" data-type="entity-link">Section</a>
                            </li>
                            <li class="link">
                                <a href="classes/SecurityPolicy.html" data-type="entity-link">SecurityPolicy</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShiftPeriodGrade.html" data-type="entity-link">ShiftPeriodGrade</a>
                            </li>
                            <li class="link">
                                <a href="classes/Student.html" data-type="entity-link">Student</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/User-1.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AcademicCatalogsService.html" data-type="entity-link">AcademicCatalogsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccessLogService.html" data-type="entity-link">AccessLogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ActionsLogService.html" data-type="entity-link">ActionsLogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CsvToJsonService.html" data-type="entity-link">CsvToJsonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CycleService.html" data-type="entity-link">CycleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorMessageService.html" data-type="entity-link">ErrorMessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GradeService.html" data-type="entity-link">GradeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PeriodService.html" data-type="entity-link">PeriodService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionService.html" data-type="entity-link">PermissionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResetPasswordService.html" data-type="entity-link">ResetPasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponsibleService.html" data-type="entity-link">ResponsibleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleService.html" data-type="entity-link">RoleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SchoolYearService.html" data-type="entity-link">SchoolYearService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SectionService.html" data-type="entity-link">SectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecurityPolicyService.html" data-type="entity-link">SecurityPolicyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ShiftService.html" data-type="entity-link">ShiftService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentService.html" data-type="entity-link">StudentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link">AuthInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/HttpErrorInterceptor.html" data-type="entity-link">HttpErrorInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Data.html" data-type="entity-link">Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-1.html" data-type="entity-link">Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Grade.html" data-type="entity-link">Grade</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJwtResponse.html" data-type="entity-link">IJwtResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ItemData.html" data-type="entity-link">ItemData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ItemData-1.html" data-type="entity-link">ItemData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ItemData-2.html" data-type="entity-link">ItemData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ItemData-3.html" data-type="entity-link">ItemData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ItemData-4.html" data-type="entity-link">ItemData</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});