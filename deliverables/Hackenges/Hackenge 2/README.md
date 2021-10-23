# Hackenge 02

------

### IF977- Engenharia de Software - Equipe 01

**Desafio Proposto:**

Cristina Lopes — professora da Universidade da Califórnia, em Irvine, nos EUA — é autora de um livro sobre estilos de programação (link). Ela discute no livro diversos estilos para implementação de um mesmo problema, chamado frequência de termos.

Dado um arquivo texto, deve-se listar as n-palavras mais frequentes em ordem decrescente de frequência e ignorando stop words, isto é, artigos, preposições, etc.

O código fonte em Python de todas as versões analisadas no livro está publicamente disponível no GitHub (e, para esse exercício, fizemos um fork do repositório original). Faça uma análise de duas dessas versões:

- Monolítica, disponível neste link: https://github.com/mtov/exercises-in-programming-style/tree/master/04-monolith 
- Orientada a objetos, disponível neste link: https://github.com/mtov/exercises-in-programming-style/tree/master/11-things

Primeiro, revise e estude o código das duas versões (cada versão tem menos de 100 linhas). Em seguida, argumente sobre as vantagens da solução OO sobre a versão monolítica. Para isso, tente extrapolar o tamanho do sistema. Suponha que ele será implementado por desenvolvedores diferentes e que cada um ficará responsável por uma parte do projeto.

------

# **Estilos para implementação**

É por meio das linguagens de programação que nos comunicamos com os computadores. Estas linguagens são constituídas de comandos, que quando utilizados corretamente, executam uma ação. Essas linguagens aparecem na década de 30, com o surgimento dos primeiros computadores elétricos por meio de cartões físicos programáveis, mas foi na década de 50 que as primeiras linguagens modernas surgiram. FORTRAN (1955), LISP e COBOL se tornaram umas das mais importantes e conhecidas durante esse período.

Em meados da década de 70, com a popularização da computação e a disseminação da Internet, cada vez mais linguagens e soluções computacionais surgem. Começam a ser criados os paradigmas da programação. Cristina Lopes - professora da Universidade da Califórnia, em Irvine, nos EUA - é autora de um livro sobre estilos de programação. Ela discute no livro diversos estilos para implementação de um mesmo problema, chamado frequência de termos. Vamos abordar dois desses estilos que são comumente utilizados até os dias de hoje: as implementações Monolíticas e Orientadas a objetos, cada uma com suas vantagens e com uma aplicação mais adequada.

## Estilo Monolítico

Nos primórdios da programação de computadores, com programação de baixo nível, linguagens e programas relativamente pequenos, esse estilo era tudo o que existia.
Em grandes aplicações em que os códigos se escalam grandemente, os sistemas baseados no estilo monolítico, geralmente possuem componentes únicos e grandes que fazem tudo o que o aplicativo precisa fazer. Ele não possui sub componentes modulares, cada um responsável por uma funcionalidade específica, sendo assim é utilizado uma única parte de código do início ao fim, e isso é considerado uma má prática de aplicação da programação em todas as escalas. Por esse motivo então, temos o estilo orientado a objetos.

Do ponto de vista do design, a principal preocupação é obter a saída desejada sem ter que pensar muito em subdividir o problema ou em como tirar proveito do código que já existe. Visto que todo o problema é uma única unidade conceitual, a programação consiste em definir os dados e o fluxo de controle que regem esta unidade. O que é potencialmente ruim, do ponto de vista da manutenção, é a existência de longos blocos de código do programa que atrapalham no quesito de fornecimento de abstrações, ao leitor, de nível superior apropriadas para o que está acontecendo.

Podemos notar os pontos citados acima nesse trecho de código:

```python
# iterate through the file one line at a time
for line in open(sys.argv[1]):
	start_char = None
	i = 0
	for c in line:
		if start_char == None:
			if c.isalnum():
				# We found the start of a word
				start_char = i
			else:
				if not c.isalnum():
					# We found the end of a word. Process it
					found = False
					word = line[start_char:i].lower()
					# Ignore stop words
					if word not in stop_words:
						pair_index = 0
						# Let’s see if it already exists
						for pair in word_freqs:
							if word == pair[0]:
								pair[1] += 1
								found = True
								break
							pair_index += 1
					if not found:
						word_freqs.append([word, 1])
					elif len(word_freqs) > 1:
						# We may need to reorder
						for n in reversed(range(pair_index)):
							if word_freqs[pair_index][1] >
								word_freqs[n][1]:
								# swap
								word_freqs[n], word_freqs[
									pair_index] = word_freqs[
									pair_index], word_freqs[n]
								pair_index = n
					# Let’s reset
					start_char = None
			i += 1
```

O código é inteiriço. Um único bloco que assume a responsabilidade de resolver o problema.

Esse tipo de código pode ser escrito em qualquer linguagem. Porém, não é comum ver esse tipo de código em soluções mais modernas. Por isso, o estilo Orientado a Objetos têm maior relevância no mundo moderno, onde há uma separação por métodos dentro do código.



## Estilo Orientado a Objetos

Neste estilo, o problema é subdividido em coleções de procedimentos menores, cada coleção compartilhando e ocultando uma estrutura e / ou controle de dados principal. Essas coleções são chamadas de objetos.

Os dados desses objetos nunca são acessados diretamente. Eles estão “escondidos”, e são acessados apenas por meio dos procedimentos expostos, também chamados de métodos. A essência da orientação a objetos é simplesmente ter procedimentos que compartilham dados entre si, ocultando-os do mundo exterior. Além disso, este estilo é frequentemente associado a classes e herança.

De forma geral, os ganhos das linguagens de programação orientadas a objetos em relação às monolíticas são concentrados na legibilidade do código, na facilidade de manutenção e expansão e na programação simplificada, adicionando assim vantagens como ser independente de plataforma e ter uma sintaxe simples e legível, sem implicar negativamente na performance.

Podemos ver um exemplo desse estilo de programação no código abaixo:

```python
class DataStorageManager(TFExercise):
""" Models the contents of the file """
	def __init__(self, path_to_file):
		with open(path_to_file) as f:
			self._data = f.read()
		pattern = re.compile(’[\W_]+’)
		self._data = pattern.sub(’ ’, self._data).lower()
	def words(self):
		""" Returns the list words in storage """
		return self._data.split()
	def info(self):
		return super(DataStorageManager, self).info() + ": Mymajor data structure is a " + self._data.__class__.__name__
```

A classe acima (a DataStorageManager) fica responsável por obter dados de um arquivo exterior à aplicação e o disponibiliza por meio dos métodos words e info. Seu construtor primário lê o arquivo, limpa os dados e “esconde” os dados do texto, fornecendo o procedimento ‘words’ para retornar a lista de palavras armazenadas. 

Isto é um exemplo típico de encapsulamento em programação orientada a objetos, com o DataStorageManager sendo uma abstração dos dados de entrada da aplicação em questão.
