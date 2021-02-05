import React, { Component } from "react";
import { Route, Router, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchSpaces, fetchQuestions, fetchUser, 
	fetchAnswers, fetchComments, postComment, 
	deleteComment, postQuestion, deleteQuestion} from "../redux/ActionCreators";
import Home from "./home_page/home";
import Spaces from "./spaces_page/Spaces";
import Questions from "./all_ques_page/questions";
import Profile_page from "./profile_page/profile";
import SingleQuestion from "./single_ques/SingleQues";
import ScrollToTop from './scroll-to-top/scroll-to-top';
import Chat from "./chat/Chat";
import Login from './login_signup/login';
import Signup from './login_signup/signup'; 
import Contact from './ContactUs/contact';
import Notifications from './notifications/notification';
import AddQuestion from './add_forms/addQuestions';
import AddBlog from './add_forms/addBlogs';
import Logout from './login_signup/logout';


const mapStateToProps = (state) => {
	return {
		spaces: state.spaces,
		questions: state.questions,
		answers: state.answers,
		user: state.user,
		comments: state.comments,
		auth: state.auth
	};
};

const mapDispatchToProps = (dispatch) => ({
	 fetchSpaces: () => {
	 	dispatch(fetchSpaces());
	 },
	fetchQuestions: () => {
		dispatch(fetchQuestions());
	},
	fetchUser: () => {
		dispatch(fetchUser());
	},
	fetchAnswers: () => {
		dispatch(fetchAnswers())
	},
	fetchComments: () => {
		dispatch(fetchComments())
	},
	postComment: (questionId, author, comment) => dispatch(postComment(questionId, author, comment)),
	deleteComment: (commentId) => dispatch(deleteComment(commentId)),
	postQuestion: (question, userToken) => dispatch(postQuestion(question, userToken)),
	deleteQuestion: (quesId) => dispatch(deleteQuestion(quesId))
});

class Main extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount = () => {
		this.props.fetchSpaces();
		this.props.fetchQuestions();
		// this.props.fetchUser();
		this.props.fetchAnswers();
		this.props.fetchComments();
	}

	render() {
		const SpaceWithId = ({ match }) => {
			return (
				<Questions
					space={
						this.props.spaces.spaces.filter(
							(space) => space._id === match.params.spaceId
						)[0]
					}
					questions={this.props.questions.questions.filter(
						(question) =>
							question.tagIds.indexOf(match.params.stringId) > -1
					)}
					questionsErrMess={this.props.questions.errMess}
					questionsIsLoading={this.props.questions.isLoading}
					errMess={this.props.spaces.errMess}
					isLoading={this.props.spaces.isLoading}
				/>
			);
		};

		const HomeQuestions = () => {
			return(
				<Home 
					// questions={this.props.questions.questions.map((ques) => {
					// 	ques.tagIds.filter((tag) => {
					// 		this.props.user.interests.indexOf(tag, 10) >-1
					// 	})
					// })}
					// questions={this.props.questions.questions.filter(
					// 	(ques) => {
					// 		ques.tagIds.filter((tag) => {
					// 			this.props.user.user.interests.indexOf(tag, 10) >-1
					// 		})
					// 	}
					// )}
					questions={this.props.questions.questions}
					isLoading={this.props.questions.isLoading}
					errMess={this.props.questions.errMess}
					spaces={this.props.spaces}
				/>
			);
		}

		const QuestionWithId = ({ match }) => {
			return(
				<SingleQuestion
					question={
						this.props.questions.questions.filter((ques) => ques._id === match.params.quesId)[0]
					}
					isLoading={this.props.questions.isLoading}
					errMess={this.props.spaces.errMess}
					answers = {
						this.props.answers.answers.filter((ans) => ans.questionId === parseInt(match.params.quesId, 10))
					}
					answersIsLoading = {this.props.answers.isLoading}
					answersErrMess = {this.props.answers.errMess}
					//spaceId={match.params.spaceId}
					comments = {this.props.comments.comments.filter((comm) => comm.questionId === match.params.quesId)}
					commentsErrMess={this.props.comments.errMess}
					postComment={this.props.postComment}
					deleteComment={this.props.deleteComment}
					auth={this.props.auth}
					deleteQuestion={this.props.deleteQuestion}
				/>
			);
		}

		const PrivateRoute = ({ component: Component, ...rest }) => (
			<Route {...rest} render={(props) => (
			  this.props.auth.isSignedIn
				? <Component {...props} />
				: <Redirect to={{
					pathname: '/login',
					state: { from: props.location }
				  }} />
			)} />
		  );

		return (
			<div>
				<ScrollToTop/>
				<Switch>
					<PrivateRoute path="/home" component={HomeQuestions} />
					<PrivateRoute
						exact
						path="/spaces"
						//component={Spaces}
						component={() => <Spaces spaces={this.props.spaces} fetchSpaces={this.props.fetchSpaces} />}
					/>
					<PrivateRoute exact path="/spaces/:spaceId/:stringId" component={SpaceWithId} />
					<PrivateRoute
						exact
						path="/question-:quesId-:question"
						//path="/space-:spaceId/question-:quesId-:question"
						component={QuestionWithId}
					/>
					<PrivateRoute exact path="/profile/:userId" component={Profile_page}/>
					<PrivateRoute path="/chat" component={Chat} />
					<Route path="/contact" component={Contact} />
					<PrivateRoute path="/notifications" component={Notifications}/>
					<Route path="/login" component={Login} />
					<PrivateRoute exact path="/addQuestion" component={() => <AddQuestion postQuestion={this.props.postQuestion} auth={this.props.auth}/>}/>
					<PrivateRoute path="/addBlog" component={() => <AddBlog postQuestion={this.props.postQuestion} auth={this.props.auth}/>} />
					<Route path="/signup" component={Signup} />
					<Route path="/logout" component={Logout}/>
					<Redirect to="/home" />
				</Switch>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
