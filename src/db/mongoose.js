const mongoose = require('mongoose')

const uri = "mongodb+srv://haider:myportfoliodata@cluster0.eemxw.mongodb.net/portfolios?retryWrites=true&w=majority"

mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
}
);