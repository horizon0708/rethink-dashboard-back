import * as userGen from '../src/components/userGenerator';

test('generateUser generates a valid person',()=>{
    var person = userGen.generatePerson();
    expect(person.name).toEqual(expect.any(String));
    expect(person.age).toEqual(expect.any(Number));
    expect(["NZ","AU","UK"]).toContain(person.country);
    expect(["F","M"]).toContain(person.sex);
    expect(person.joindate < Date.now()).toBe(true);
})


//async
test('generatePeople at random intervals', ()=>{
    const data = userGen.setIntervalFor(userGen.generatePerson, 10, 5);
    jest.useFakeTimers();
    jest.runAllTimers();
    console.log(data);
})