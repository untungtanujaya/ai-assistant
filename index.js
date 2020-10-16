
// function below are copied from google tsfj use (https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder)
// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith =
    (f, xs, ys) => {
      const ny = ys.length;
      return (xs.length <= ny ? xs : xs.slice(0, ny))
          .map((x, i) => f(x, ys[i]));
    }

// dotProduct :: [Int] -> [Int] -> Int
const dotProduct =
    (xs, ys) => {
      const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;
      return xs.length === ys.length ? (sum(zipWith((a, b) => a * b, xs, ys))) :
                                       undefined;
    }

const sentences = [
    'His name is Untung Tanujaya, but you can call him Joy :)',
    'He is a student from Institut Teknologi Bandung, majoring in Computer Science',
    'His hobbies are swimming, reading books, and watching movies',
    'He is a supertalented Data Scientist and i definitely recommend him to work in your company :)',
    'He is handsome, nice, but most importantly, he wants to learn'
];

//Given a query taken from input text (id question), an array of responses, and the model
//Output: response with the best score
const initQnA = async (query, responses, model) => {
    const input = {
        queries: [query.value.toLowerCase()],
        responses: responses
    };
    let result = model.embed(input);
    const query = result['queryEmbedding'].arraySync();
    const answers = result['responseEmbedding'].arraySync();
    let scores = []
    for (let i = 0; i < answers.length; i++) {
        scores.push(dotProduct(query, answers[i]))
    }
    let max_i = scores.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    if (scores[max_i] < 10.5) {
        return "Sorry, I can't respond to that question for now. Please reach Untung out directly through LinkedIn to discuss your question";
    } else {
        return input['responses'][max_i];
    }
}

window.onload = () => {
    let question = document.getElementById('question');
    let answer = document.getElementById('answer');

    question.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            let model = use.loadQnA();
            initQnA(question, sentences, model).then(answer.innerHTML);
        }
    });
};
