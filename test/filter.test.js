const Filter = require('../src/index');
const {
  NotAFunctionError, NoFiltersError, NoArgumentsPassedError,
  InvalidOptionError, InvalidApproachError
} = require('../src/errors');


const passFirstArgument = (a, _) => a;
const passSecondArgument = (_, b) => b;
const emptyFunction = () => null;

const testCaseZeroZero = [0, 0];
const testCaseOneZero = [1, 0];
const testCaseOneOne = [1, 1];
const sum = (a, b) => a + b;
const notAFunction = "NOT A FUNCTION";
const invalidApproach = "NONE";


describe("Test Approach", () => {
  test('Default approach is AND', () => {
    expect(new Filter().isApproach(Filter.Approaches.AND)).toBe(true);
  });

  test('Approach can be changed by function or setter', () => {
    const f = new Filter();
    expect(f.isApproach(Filter.Approaches.AND)).toBe(true);
    expect(f.setApproach(Filter.Approaches.OR).isApproach(Filter.Approaches.OR)).toBe(true);
    expect(f.setApproach(Filter.Approaches.AND).isApproach(Filter.Approaches.AND)).toBe(true);
    expect(() => { f.setApproach(invalidApproach) }).toThrow(new InvalidApproachError(invalidApproach));

    f.approach = Filter.Approaches.OR;
    expect(f.isApproach(Filter.Approaches.OR)).toBe(true);
    f.approach = Filter.Approaches.AND;
    expect(f.isApproach(Filter.Approaches.AND)).toBe(true);
    expect(() => { f.approach = invalidApproach }).toThrow(new InvalidApproachError(invalidApproach));
  });

  test('Approach can be set by options (last argument in new Filter object)', () => {
    expect(new Filter({ approach: Filter.Approaches.OR }).isApproach(Filter.Approaches.OR)).toBe(true);
    expect(new Filter({ approach: Filter.Approaches.AND }).isApproach(Filter.Approaches.AND)).toBe(true);
    expect(() => { new Filter({ approach: invalidApproach }) }).toThrow(new InvalidApproachError(invalidApproach));
  });


  test('Filter AND', () => {
    const f = new Filter({ filters: [passFirstArgument, passSecondArgument] });
    expect(f.try(...testCaseOneOne).finally(sum)).toBe(2);
    expect(f.try(...testCaseOneZero).finally(sum)).toBeNull();
    expect(f.try(...testCaseZeroZero).finally(sum)).toBeNull();
  });


  test('Filter OR', () => {
    const f = new Filter({ filters: [passFirstArgument, passSecondArgument], approach: Filter.Approaches.OR });
    expect(f.try(...testCaseOneOne).finally(sum)).toBe(2);
    expect(f.try(...testCaseOneZero).finally(sum)).toBe(1);
    expect(f.try(...testCaseZeroZero).finally(sum)).toBeNull();
  });
})


describe("Test filter functions", () => {

  test('Filters is a function', () => {
    expect(new Filter()).toBeInstanceOf(Filter);
    expect(new Filter({})).toBeInstanceOf(Filter);
  });

  test('Filters should be a function', () => {
    const f = new Filter();
    expect(f.add(emptyFunction)).toBe(f);
    expect(() => { f.add(notAFunction) }).toThrow(new NotAFunctionError(notAFunction));
    expect(f.add(emptyFunction, passFirstArgument, passSecondArgument)).toBe(f);
    expect(() => { f.add(notAFunction, emptyFunction, passFirstArgument) }).toThrow(new NotAFunctionError(notAFunction));
  });

  test('At least one filter should be added', () => {
    const f = new Filter();
    expect(() => { f.execute(...testCaseOneOne) }).toThrow(new NoFiltersError());
  });
})


describe("Test arguments to filter", () => {
  test('At least one argument should be passed', () => {
    const f = new Filter({ filters: [passFirstArgument] });
    expect(() => { f.execute() }).toThrow(new NoArgumentsPassedError());
  });
})


describe("Test the final function", () => {
  test('isSuccess property returns status of latest filtering', () => {
    const f = new Filter({ filters: [passFirstArgument, passSecondArgument] });
    // By Default - undefined
    expect(f.isSuccess).toBeUndefined();
    // try() to filter with success result
    f.try(...testCaseOneOne);
    // Check that latest result is success
    expect(f.isSuccess).toBe(true);
    // try() to filter with unsuccess result
    f.try(...testCaseOneZero);
    // Check that latest result is unsuccess
    expect(f.isSuccess).toBe(false);
  });

  test('finally() can be run only when argument is function', () => {
    const f = new Filter({ filters: [passFirstArgument] });
    expect(f.try(...testCaseOneOne).finally(sum)).toBe(2);
    expect(() => { f.try(...testCaseOneOne).finally(notAFunction) }).toThrow(new NotAFunctionError(notAFunction));
  });

  test('The final function can be changed by function or setter', () => {
    const f1 = new Filter();
    // Default the final value is undefined
    expect(f1.final).toBeUndefined();

    // Add the final function by set function
    expect(f1.addFinal(sum).final).toBe(sum);
    expect(() => { f1.addFinal(notAFunction) }).toThrow(new NotAFunctionError(notAFunction));

    const f2 = new Filter();
    // Add the final function by setter
    f2.final = sum;
    expect(f2.final).toBe(sum);
    expect(() => { f2.final = notAFunction; }).toThrow(new NotAFunctionError(notAFunction));
  });

  test('Repeat method can be executed only is final function added', () => {
    const f = new Filter({ filters: [passFirstArgument] });
    expect(() => { f.repeat(...testCaseOneOne) }).toThrow(new NotAFunctionError(undefined));
    f.final = sum;
    expect(f.repeat(...testCaseOneOne)).toBe(2);
  });
})

describe("Test constructor and options", () => {
  test('New Filter construct arguments parsing', () => {
    const oneFilter = new Filter({ filters: [passFirstArgument] });
    expect(oneFilter.isApproach(Filter.Approaches.AND)).toBe(true);
    expect(oneFilter.filters).toHaveLength(1);

    const twoFilters = new Filter({ filters: [passFirstArgument, passSecondArgument] })
    expect(twoFilters.isApproach(Filter.Approaches.AND)).toBe(true);
    expect(twoFilters.filters).toHaveLength(2);

    const oneFilterAndOptions = new Filter({ filters: [passFirstArgument], approach: Filter.Approaches.OR });
    expect(oneFilterAndOptions.isApproach(Filter.Approaches.OR)).toBe(true);
    expect(oneFilterAndOptions.filters).toHaveLength(1);

    const twoFiltersAndOptions = new Filter({ filters: [passFirstArgument, passSecondArgument], approach: Filter.Approaches.OR })
    expect(twoFiltersAndOptions.isApproach(Filter.Approaches.OR)).toBe(true);
    expect(twoFiltersAndOptions.filters).toHaveLength(2);

    const filterWithFinal = new Filter({ final: sum });
    expect(filterWithFinal.final).toBe(sum);

    const filterWithoutOptions = new Filter();
    expect(filterWithoutOptions.isApproach(Filter.Approaches.AND)).toBe(true);
    expect(filterWithoutOptions.filters).toHaveLength(0);
    expect(filterWithoutOptions.final).toBeUndefined();
  });

  test('setOptions() can pass only allowed to set options', () => {
    const f = new Filter();
    // Default approach is "AND"
    expect(f.approach).toBe(Filter.Approaches.AND);

    f.setOptions({ approach: Filter.Approaches.OR });
    expect(f.approach).toBe(Filter.Approaches.OR);

    expect(f.final).toBeUndefined();
    f.setOptions({ final: sum });
    expect(f.final).toBe(sum);

    expect(() => { f.setOptions({ filters: [passFirstArgument] }) }).toThrow(new InvalidOptionError("filters", [passFirstArgument]))
  });
})
