let objAllTest = {},
    objTest = {
        persons: [
            ["Andrea", "Rossi", "Publisher", "Male", false, true, "N0"],
            ["Paolo", "Bonolis", "Pioneer", "Male", true, false, "N1"],
            ["Giorgia", "Rossi", "Pioneer", "Female", true, true, "N2"],
            ["Davide", "Rossi", "Elder", "Male", true, true, "N3"],
            ["Marta", "Balestri", "Publisher", "Female", false, true, "N4"]
        ],
    };
createChilds(objTest, objAllTest);

beforeAll(function(){
    pairingAlgorithm(objAllTest)
})

describe('Testing pairing algorithm',function(){
    it('Day pairing is reached', function(){
        expect(calendar[0].length).toEqual(parameters.day.mon)
        expect(calendar[6].length).toEqual(parameters.day.sun)
    })
    it('First person is Pioneer or Elder', function(){
        expect(calendar[0][0][0]).not.toEqual('N0')
    })
    it("Paolo isn't paired with other sex", function(){
        let testing = false;
        calendar.forEach((day)=>{
            day.forEach((apoint)=>{
                if(apoint[0]==='N1'&&apoint[1]==='N2') testing = true
            })
        })
        expect(testing).toBeFalsy()
    }) 
    it("Andrea isn't paired with people that can't bring kolichka as well", function(){
        let testing = false;
        calendar.forEach((day)=>{
            day.forEach((apoint)=>{
                if(apoint[0]==='N0'&&apoint[1]==='N2') testing = true
            })
        })
        expect(testing).toBeFalsy()
    }) 
    it("Percent of publisher to be as expected", function(){
        let count = 0, allCount = 0
        calendar.forEach((day)=>{
            day.forEach((apoint)=>{
                if(apoint[1]==='N0') count++
            })
        })
        for (const val in parameters.day) {
            allCount += parameters.day[val]
        }
        expect((count/allCount)*100).toBeLessThanOrEqual(25)
    }) 
})

  