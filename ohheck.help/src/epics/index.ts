﻿import { combineEpics } from 'redux-observable';

import {
    fetchSurveyEpic,
    submitSurveyEpic
} from './survey';

import {
    fetchGroupsEpic,
    fetchGroupsListEpic,
    fetchSubunitsEpic,
    fetchSubunitsListEpic,
    fetchIdolsEpic,
    fetchIdolsListEpic,
    fetchSurveysEpic,
    fetchResponsesEpic,
    fetchResponsesByCardEpic,
    fetchCardsEpic,
    fetchCardEpic,
    fetchIdolEpic
} from './admin';

import {
    fetchMgmtSurveyEpic,
    fetchPossibleCardsEpic
} from './surveymgmt';

export const rootEpic = combineEpics(
    fetchGroupsEpic,
    fetchGroupsListEpic,
    fetchSubunitsEpic,
    fetchSubunitsListEpic,
    fetchIdolsEpic,
    fetchIdolsListEpic,
    fetchSurveysEpic,
    fetchResponsesEpic,
    fetchResponsesByCardEpic,
    fetchMgmtSurveyEpic,
    fetchSurveyEpic,
    fetchCardsEpic,
    fetchCardEpic,
    fetchPossibleCardsEpic,
    fetchIdolEpic,
    submitSurveyEpic
);