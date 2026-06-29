# App

GymPass style app.

## RFs (Requisitos funcionais)
- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após criado;
- [x] O check-in só pode ser validado por adminstradores ou gerentes;
- [x] A academia só pode ser cadastrada por administradores

## RNFs (Requisitos não funcionais)
- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco postgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por páginas;
- [x] O usuário deve ser identificado por JWT (json web token)



        - name: Install dependencies
        run: |
            npm install

        - name: Run tests
        run: |
            npm test

        - name: Set up Python 3.8
        uses: actions/setup-python@v2
        with:
            python-version: 3.8

        - name: Install dependencies
        run: |
            python -m pip install --upgrade pip
            pip install -r requirements.txt

        - name: Run tests
        run: |
            python -m unittest discover tests
    build:
        runs-on: ubuntu-latest
    
        steps:
        - uses: actions/checkout@v2
    
        - name: Set up Python 3.8
        uses: actions/setup-python@v2
        with:
            python-version: 3.8
    
        - name: Install dependencies
        run: |
            python -m pip install --upgrade pip
            pip install -r requirements.txt
    
        - name: Run tests
        run: |
            python -m unittest discover tests
     
     The workflow file is written in YAML format and contains the following sections: 
     
     name : The name of the workflow. 
     on : The event that triggers the workflow. In this case, the workflow is triggered on every push to the repository. 
     jobs : The jobs that the workflow will run. Each job runs in a separate environment. 
     
     The  build  job runs on an Ubuntu environment and contains the following steps: 
     
     uses: actions/checkout@v2 : Checks out the repository code. 
     uses: actions/setup-python@v2 : Sets up Python 3.8. 
     run : Installs the dependencies listed in the  requirements.txt  file. 
     run : Runs the unit tests using the  unittest  module. 
     
     The workflow file is saved in the  .github/workflows  directory of the repository. 
     The workflow is triggered when you push changes to the repository. The workflow checks out the code, sets up Python 3.8, installs the dependencies, and runs the unit tests. 
     Conclusion 
     In this tutorial, you set up a Python project with unit tests and a GitHub Actions workflow to run the tests automatically. 
     You created a Python project with a simple function and a unit test for the function. You then created a GitHub Actions workflow that runs the unit tests when you push changes to the repository. 
     You can use this workflow as a starting point to set up continuous integration for your Python projects. 
     To learn more about GitHub Actions, check out the  GitHub Actions documentation. 
     Join our DigitalOcean community of over a million developers for free! Get help and share knowledge in our Questions & Answers section, find tutorials and tools that will help you grow as a developer and scale your project or business, and subscribe to topics of interest. 
     GitHub Actions is a feature on GitHub's platform for automating your workflow. You can write individual tasks, called actions, and combine them to create a custom workflow.