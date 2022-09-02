class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter = () => {
        const queryObj = {...this.queryString};
        const excluded = ['page', 'sort', 'limit', 'fields'];
        excluded.forEach(el => delete queryObj[el]);
       
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, matched => `$${matched}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort = () => {
    
        if (this.queryString.sort) {
            const sortCriteria = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortCriteria);
        } 
        return this;
    }

    project = () => {
        if (this.queryString.fields) {
            const fieldCriteria = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fieldCriteria);
        } else {
            this.query = this.query.select('-__v')
        }
        return this;
    }

    paginate = () => {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
    
        this.query = this.query.skip((page - 1) * limit).limit(limit);

        // if (this.queryString.page) {
        //     const numTours = await Tour.countDocuments();
        //     if ((page - 1) * limit>= numTours) throw new Error('This page does not exist')
        // }
        return this;
    }
}

module.exports = APIFeatures;