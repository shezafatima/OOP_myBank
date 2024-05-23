import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccNumber(obj) {
        this.account.push(obj);
    }
    transaction(accobj) {
        let newAccount = this.account.filter(acc => acc.accNumber !== accobj.accNumber);
        this.account = [...newAccount, accobj];
    }
}
let myBank = new Bank();
for (let i = 1; i <= 5; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number());
    const cus = new Customer(fName, lName, 17 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccNumber({
        accNumber: cus.accNumber,
        balance: 10000 * i
    });
}
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            name: "select",
            type: "list",
            message: "Please Select the Service:",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk.redBright.bold.italic("INVALID ACCOUNT NUMBER!"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.greenBright.italic.bold(name?.firstName)} ${chalk.greenBright.italic.bold(name?.lastName)} your Account Balance is ${chalk.bold.italic.blueBright(`$${account.balance}`)}`);
            }
        }
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk.redBright.bold.italic("INVALID ACCOUNT NUMBER!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Enter your Amount:",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.bold.italic.greenBright("INSUFFICIENT BALANCE!"));
                }
                let newBalance = account.balance - ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Enter your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.number);
            if (!account) {
                console.log(chalk.redBright.bold.italic("INVALID ACCOUNT NUMBER!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Enter your Amount:",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.select == "Exit") {
            console.log(chalk.bold.italic.magentaBright("EXISTING..."));
            process.exit();
        }
    } while (true);
}
console.log(chalk.bold.italic.yellowBright("WELCOME TO MY BANK"));
console.log((chalk.bold.redBright("*").repeat(7)), chalk.bold.magentaBright("*").repeat(7), chalk.bold.greenBright("*").repeat(7));
bankService(myBank);
