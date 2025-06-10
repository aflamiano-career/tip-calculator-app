import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const PERCENTAGE = 100;

function App() {
  const [tipPercentage, setTipPercentage] = useState("0");
  const [isTipping, setIsTipping] = useState(false);
  const isTippingRef = useRef(isTipping);

  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: "onChange",
    defaultValues: { bill: "0", people: "1", custom: "Custom" },
  });

  function handleTip(tip) {
    const actualIsTipping = tip === tipPercentage ? false : true;

    isTippingRef.current = actualIsTipping;
    setIsTipping(actualIsTipping);
    actualIsTipping ? setTipPercentage(tip) : setTipPercentage(0);

    reset(undefined, { keepValues: true });
    setValue("custom", "Custom");
  }

  const bill = watch("bill");
  const people = watch("people");
  const custom = watch("custom");
  const tip = !errors.custom
    ? Number(custom)
      ? Number(custom)
      : Number(tipPercentage)
    : 0;
  const tipAmount = tip ? (Number(bill) * tip) / PERCENTAGE : 0;
  const tipPerPerson = tipAmount ? tipAmount / Number(people) : 0;
  const totalAmount = Number(bill) / Number(people) + tipPerPerson;

  return (
    <main className="min-h-screen flex justify-center items-center font-spaceMono bg-Grey200">
      <div className="flex flex-col items-center self-stretch sm:self-auto">
        <header className="my-10">
          <img src="images/logo.svg" alt="Splitter App logo" />
        </header>
        <section className="bg-white lg:grid lg:grid-cols-2 lg:gap-12 p-8 sm:px-20 sm:py-14 rounded-t-3xl sm:rounded-b-3xl max-w-xl lg:max-w-5xl h-full">
          <form>
            <div className="flex justify-between">
              <label htmlFor="bill" className="font-bold text-Grey500">
                Bill
              </label>
              {errors.bill && (
                <span className="font-bold text-red-400 text-right">
                  {errors.bill.message}
                </span>
              )}
            </div>
            <div className="relative mt-2 mb-8">
              <img
                src="images/icon-dollar.svg"
                alt="Dollar icon"
                className="absolute top-1/2 -translate-y-1/2 left-4"
              />
              <input
                id="bill"
                className="bg-Grey50 text-right px-4 py-2 w-full font-bold text-2xl text-Green900"
                onFocus={(e) => e.target.select()}
                {...register("bill", {
                  min: {
                    value: 0,
                    message: "Must not be negative",
                  },
                  pattern: {
                    value: /^\d+(\.\d*)?$/,
                    message: "Must be a valid number",
                  },
                })}
              />
            </div>
            <p className="mb-2 font-bold text-Grey500">Select Tip %</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
              {[5, 10, 15, 25, 50].map((tip) => (
                <button
                  key={tip}
                  type="button"
                  className={`font-bold text-2xl rounded-sm h-12 hover:bg-Green400/75 hover:text-Green900 ${
                    !dirtyFields.custom
                      ? tip === tipPercentage
                        ? isTipping
                          ? "bg-Green400 text-Green900"
                          : "bg-Green900 text-white"
                        : "bg-Green900 text-white"
                      : "bg-Green900 text-white"
                  }`}
                  onClick={() => handleTip(tip)}
                >
                  {tip}%
                </button>
              ))}
              <input
                id="custom"
                className="bg-Grey50 text-center font-bold text-2xl text-Green900"
                onFocus={(e) => e.target.select()}
                {...register("custom", {
                  required: "Please enter a value",
                  pattern: {
                    value: /^[1-9][0-9]?$|^100$/,
                    message: "Must be a valid whole number between 1-100",
                  },
                })}
              />
              {errors.custom && (
                <span className="col-span-2 sm:col-span-3 font-bold text-right text-red-400">
                  {errors.custom.message}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <label htmlFor="people" className="font-bold text-Grey500">
                Number of People
              </label>
              {errors.people && (
                <span className="font-bold text-red-400 text-right">
                  {errors.people.message}
                </span>
              )}
            </div>
            <div className="relative mt-2 mb-8">
              <img
                src="images/icon-person.svg"
                alt="Dollar icon"
                className="absolute top-1/2 -translate-y-1/2 left-4"
              />
              <input
                id="people"
                className="bg-Grey50 text-right px-4 py-2 w-full font-bold text-2xl text-Green900"
                onFocus={(e) => e.target.select()}
                {...register("people", {
                  required: "Please enter a value",
                  min: {
                    value: 0,
                    message: "Must not be negative",
                  },
                  pattern: {
                    value: /^[1-9][0-9]*$/,
                    message: "Cannot be zero",
                  },
                })}
              />
            </div>
          </form>
          <div className="flex flex-col rounded-2xl p-6 sm:p-10 gap-6 font-bold bg-Green900 text-white">
            <div className="flex justify-between overflow-x-auto overflow-y-hidden">
              <div className="mr-2">
                <p>Tip Amount</p>
                <p className="text-sm text-Grey400">/ person</p>
              </div>
              <div className="text-right text-3xl sm:text-5xl text-Green400">
                $
                {!errors.bill && !errors.people && !errors.custom
                  ? tipPerPerson.toFixed(2)
                  : "0.00"}
              </div>
            </div>
            <div className="flex justify-between overflow-x-auto overflow-y-hidden">
              <div className="mr-2">
                <p>Total</p>
                <p className="text-sm text-Grey400">/ person</p>
              </div>
              <div className="text-right text-3xl sm:text-5xl text-Green400">
                $
                {!errors.bill && !errors.people && !errors.custom
                  ? totalAmount.toFixed(2)
                  : "0.00"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                reset();
              }}
              className="mt-auto text-2xl text-Green900 rounded-sm h-12 bg-Green400 uppercase w-full"
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
