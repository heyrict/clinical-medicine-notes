统计学
======
## 基本概念
1. 统计分析方法
    - 统计描述与统计推断结合
    - 可信区间与假设推断结合
    - 参数估计与假设检验结合
    - 统计量与p值结合
    - 统计学结论与专业结论结合

1. 样本量计算方法

1. 试验研究的基本要素
    - 处理因素：外加于受试对象，在试验中需要观察并阐明其效应的因素
    - 受试对象
    - 实验效应

1. 试验设计基本原则
    - 对照
        - 均衡性：对等、同步、专设
    - 设计
        - 配对设计
        - 平行组设计
        - 交叉设计
    - 随机

## 统计分析方法
### 概述
1. 完全随机设计
    - 定量资料
        - 两样本
            - 成组 t 检验
            - 两组秩和检验
        - 多样本
            - One-way ANOVA (normal dist.)
            - KWallis Test (not normal dist.)
    - 定性资料: $\chi^2 Test$
    - 等级资料
        - 两样本: 两组秩和检验
        - 多样本: KWallis Test

1. 配对设计
    - 定量资料
        - 两样本
            - 配对 t 检验
            - 配对秩和检验
        - 多样本
            - Two-way ANOVA
            - Friedman Test
    - 等级资料
        - 两样本: 配对秩和检验
        - 多样本: Friedman Test

### Student's t test
1. General assumptions: $t = \frac{Z}{s} = \frac{\bar{X} - \mu}{stderr}$

#### One sample t test
1. Null hypothesis: The mean of the population equals to some specific value

1. Assumptions
    - $Z$ and $s$ are independent
    - $s^2 \sim \chi^2(p)$
    - $\bar{X} \sim N(\mu,stderr)$

1. Parameters
    - freedom: $n - 1$

#### Two sample t test
1. Null hypothesis: The means of the two populations are equal

1. Assumptions
    - Two populations are independently sampled
    - Mean of two populations should follow a normal distribution
    - Variance of two populations should be equal

1. Parameters
    - unpaired
        - freedom: $n_1 + n_2 - 2$
    - paired
        - freedom: $n - 1$

### Mann-Whitney u test
1. Null hypothesis: the distributions of both populations are equal

1. Assumptions
    - all observations from both groups are independent of each other
    - responses are ordinal

1. Calculation
    - Direct method: u = sum of the count of the rank every observation wins
    - Indirect method

### Wilcoxon signed-rank test
1. Null hypothesis: difference between the pairs follows a symmetric distribution around zero

1. Assumptions
    - Data are paired and come from the same population.
    - Each pair is chosen randomly and independently.
    - The data are measured on at least an interval scale when, as is usual, within-pair differences are calculated to perform the test (though it does suffice that within-pair comparisons are on an ordinal scale).

1. Calculation
    - For $i = 1, ..., N$, calculate $|x_{2,i} - x_{1,i}|$ and $\sgn(x_{2,i} - x_{1,i})$, where sgn is the sign function.
    - Exclude pairs with $|x_{2,i} - x_{1,i}| = 0$. Let $N_r$ be the reduced sample size.
    - Order the remaining $N_r$ pairs from smallest absolute difference to largest absolute difference, $|x_{2,i} - x_{1,i}|$.
    - Rank the pairs, starting with the smallest as 1. Ties receive a rank equal to the average of the ranks they span. Let $R_{i}$ denote the rank.
    - Calculate the test statistic W. $$W=\sum_{{i=1}}^{{N_{r}}}[\operatorname{sgn}(x_{{2,i}}-x_{{1,i}})\cdot R_{i}$$, the sum of the signed ranks.

    - Under null hypothesis, W follows a specific distribution with no simple expression. This distribution has an expected value of 0 and a
      variance of ${\frac {N_{r}(N_{r}+1)(2N_{r}+1)}{6}}$.

      W can be compared to a critical value from a reference table.

      The two-sided test consists in rejecting $H_{0}$ if $|W|>W_{critical,N_{r}}$.

    - As $N_r$ increases, the sampling distribution of $W$ converges to a normal distribution. Thus,
      For $N_{r}\geq 20$, a z-score can be calculated as $z={\frac {W}{\sigma_{W}}}$, where $\sigma_{W}={\sqrt{\frac{N_{r}(N_{r}+1)(2N_{r}+1)}{6}}}$
      To perform a two-sided test, reject $H_{0}$ if $|z|>z_{{critical}}$.
      Alternatively, one-sided tests can be performed with either the exact or the approximate distribution. p-values can also be calculated.

    - For $N_{r}<20$ the original test using the T statistic is applied.

       Denoted by Siegel as the T statistic, it is the smaller of the two sums of ranks of given sign;
       in the example given below, therefore, T would equal 3+4+5+6=18.
       Low values of T are required for significance.
       As will be obvious from the example below, T is easier to calculate by hand than W and
       the test is equivalent to the Low two-sided test described above;
       however, the distribution of the statistic under $H_{0}$ has to be adjusted.


### Pearson's $\chi^2$ test
1. Null hypothesis: rows are independent of cols

1. [Assumptions](https://sites.google.com/statistics/notes/chisqr_assumptions)
    - Tables larger than 2x2
        - Sample size
            - all individual expected counts &gt; 1
            - less than 20% of the expected counts &lt; 5
        - Independence: each observation is independent of all the others
    - 2x2 tables
        - Sample size
            - all individual expected counts &gt; 10
            - (controversial) applying Yates' Correlation if any expected counts in 5 ≤ x &lt; 10
            - use Fisher exact test if any expected counts &lt; 5
        - Independence: each observation is independent of all the others
    - *The latest advice for 2x2 tables*
        - Sample size
            - use $N - 1$ chi-squared test for all individual expected counts great than or equal 1
            - use Fisher exact test otherwise

1. Parameters
    - freedom: (n_rows - 1) * (n_cols - 1)

1. Calculation
    - For 2x2 tables:
        - Pearson's chi-square: $\chi^2 = \frac{N(ad - bc)^2}{mnrs}$
        - $N-1$ chi-square: $\chi^2 = \frac{(N - 1)(ad - bc)^2}{mnrs}$
    - For nxn tables: $\chi^2 = \sum{\frac{(Observed - Expected)^2}{Expected}}$
