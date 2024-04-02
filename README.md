# Canvas Rubric
Download Assignments and Quiz rubric scores (and comments, only for Assignments right now).

A canvas submission has two scores: the Submission Score and the Rubric Total Score. These may be provided by different users (i.e a TA uses the rubric and the Instructor gives a final score). The data provided here only indicates the Rubric Grader which may be different than the provider of the Submission Score.

Canvas Rubric returns a CSV with the following headers:
* Student Name
* Student Number (SIS ID)
* Student Canvas ID
* Section Name
* Submission State
* Submission Score [the score given to the submission, seperate from the rubric]
* Rubric Grader Name
* Rubric Grader Role
* Rubric Total Score [the total score from the rubric]
* Each individual component of the rubric (grade and comments)
* Overall submission comments made by non-students only (student comments are filtered out)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for use with your own API tokens and Canvas domains.

### Prerequisites

1. **Install [Node 8.0.0 or greater](https://nodejs.org)**.
2. **Install [Git](https://git-scm.com/downloads)**.

### Host URL and Token setup
1. Create a `.env` file.
1. Add the following: `CANVAS_API_TOKEN={YOUR API TOKEN}` and `CANVAS_API_DOMAIN={YOUR API DOMAIN}`.
An example `CANVAS_API_DOMAIN` is `https://{school}.instructure.com/api/v1`

### Installation and starting application

1. Clone this repo. `git clone https://github.com/ubccapico/canvas-rubric.git`
1. Then cd into the repo. `cd canvas-rubric`
1. Run the installation script. `npm install` (If you see `babel-node: command not found`, you've missed this step.)
1. Run the application. `npm start`
1. You'll be asked a series of prompts, and then the data will be output in `output` folder.
1. If you re-run the script for the same course, we recommend deleting the previous output file first

## Authors

* [justin0022](https://github.com/justin0022) -
**Justin Lee** &lt;justin.lee@ubc.ca&gt;

## Issues
Run into any problems? It may be because the course you selected has no rubrics. Or it may be because you've discovered a bug.

Please submit an [issue](https://github.com/ubccapico/canvas-rubric/issues/new) detailing your problem (the more context you can provide, the better) and I'll take a look.

## License

This project is licensed under the GNU General Public License v3.0.
