﻿import { FETCH_SURVEY, SUBMIT_SURVEY } from 'constants/survey';

import {
    fetchSurvey,
    fetchSurveyFulfilled,
    submitSurvey,
    submitSurveyFulfilled
} from 'actions/survey';

import { post, serverResp } from './utils';
import { ajax } from 'rxjs/observable/dom/ajax';
import { Survey } from 'types/admin';
import 'rxjs';
import { Observable } from 'rxjs/Observable';


export const fetchSurveyEpic = action$ =>
    action$.ofType(FETCH_SURVEY)
        .mergeMap(action =>
            ajax.getJSON(`/api/survey/${action.slug}`)
                .map(response => new Survey(response))
                .map(survey => fetchSurveyFulfilled(survey))
        );

export const submitSurveyEpic = (action$, state) =>
    action$.ofType(SUBMIT_SURVEY)
        .mergeMap(action =>
            post<serverResp>('/api/submit', action.submission, state.getState().admin.bearer)
                .map(resp => submitSurveyFulfilled(resp.success, resp.message))
                .catch(err => Observable.of(submitSurveyFulfilled(false, 'A server error occurred.'))));