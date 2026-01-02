// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as nock from 'nock';
import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import * as snapshot from 'snap-shot-it';

import {GitHub} from '../src/github';

nock.disableNetConnect();

const fixturesPath = './test/fixtures';

describe('GitHub file pagination', () => {
  let github: GitHub;
  let req: nock.Scope;

  beforeEach(async () => {
    req = nock('https://api.github.com/')
      .get('/repos/fake/fake')
      .optionally()
      .reply(200, {
        default_branch: 'main',
      });
    github = await GitHub.create({
      owner: 'fake',
      repo: 'fake',
      defaultBranch: 'main',
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('paginates through pull request files', async () => {
    const graphql = JSON.parse(
      readFileSync(
        resolve(fixturesPath, 'commits-since-many-files-paginated-1.json'),
        'utf8'
      )
    );
    const graphql2 = JSON.parse(
      readFileSync(
        resolve(fixturesPath, 'commits-since-many-files-paginated-2.json'),
        'utf8'
      )
    );
    req
      .post('/graphql')
      .reply(200, {
        data: graphql,
      })
      .post('/graphql')
      .reply(200, {
        data: graphql2,
      });

    const targetBranch = 'main';
    const commits = await github.commitsSince(
      targetBranch,
      commit => {
        return commit.sha === 'b29149f890e6f76ee31ed128585744d4c598924c';
      },
      {backfillFiles: true}
    );

    expect(commits.length).to.eql(1);
    const commit = commits[0];
    expect(commit.files).to.not.be.undefined;
    // one file from the first page, 100 from the second.
    expect(commit.files?.length).to.eql(101);
    snapshot(commits);
  });
});
