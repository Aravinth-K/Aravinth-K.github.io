---
layout: post
title: '$S$-duality of the Unflavoured Schur Index of $\mathcal N=4$ SYM'
short_title: S-duality of the Unflavoured Schur Index of N=4 SYM
date: 2026-07-30
description: Showing two integrals are the same.
tags: [physics, maths, sym, indices, integrals, lie-algebras, duality]
---


## 1 Introduction

During my DPhil I became interested in a toy problem suggested by a postdoc. The problem was loosely related to matrix models, something I had been working on up until that point.

> **Problem 1.** *Bourdier, Drukker, and Felix have obtained an exact, all-rank expression for the Schur index of $\mathcal{N}=4$ SYM with gauge group $U(n)$ [[1]](#ref-1).* *Find the corresponding expression for the other classical Lie algebras and/or include a flavour fugacity.*

What this means will be discussed more fully in due course. Why is this interesting?

* **Spectral information.**
An important part of the data defining a quantum theory is its spectrum, i.e. the energies, charges, and other quantum numbers associated with its states. In an interacting quantum theory, the spectrum generally depends on the coupling and is difficult to determine. The Schur index encodes information about the spectrum that is protected. Although individual states and their energies may vary, the index remains the same.

* **Duality.**
A central paradigm in quantum field theory is duality. Two theories that appear entirely different end up describing the same underlying physics. Since the index encodes protected information about the spectrum, equality of indices is a necessary (although not sufficient) test for duality.

A prominent example of this is the conjectured S-duality of $\mathcal{N}=4$ SYM. This relates the theory with gauge group $G$ to the theory with the Langlands-dual gauge group $G^\vee$. This motivates the following problem:

> **Problem 2.** Show that the Schur index of $\mathcal{N}=4$ SYM with gauge group $SO(2n+1)$ is equal to the Schur index of the same theory with gauge group $USp(2n)$.

Why these two? These groups are singled out because (for $n\geqslant 3$) they are distinct families of groups (they are not self-dual). Therefore the correspondence is a non-trivial test of S-duality. It is these two cases that I am most interested in.

In practice Problem 1 boils down to evaluating a set of matrix integrals. Evaluating them and constructing the exact all-rank expression would likely allow one to solve Problem 2. However, not solving Problem 1 does not prevent us from solving Problem 2.

These questions have sort of arbitrarily served as my 'benchmark' for LLM capabilities. Each time a new model comes out I run it by the LLM and see what they suggest and, until recently, have been quite disappointed. I now think GPT-5.6 Sol has solved my problem.

Chat log:

* [First thread](https://chatgpt.com/share/6a602193-90c0-83ee-9de1-a9eeef020547). Where I asked Problem 1 and prodded the model towards Problem 2.
* [Second thread](https://chatgpt.com/share/6a6021ac-879c-83ee-843e-f9e6fb2e09be). Where the model worked through Problem 2.

I thought it was quite interesting. I went through and did all the calculations and they seemed to hold (although I may have made a mistake!).
The argument didn't require particularly sophisticated maths, so I thought it might be nice to share a condensation of the result.

*Disclaimer*: LLMs have recently solved much more significant problems in Mathematics. While I believe the problem discussed in this article was an open problem I do not believe it is a terribly significant result.

## 2 Background

The superconformal index of a four-dimensional superconformal field theory was introduced in [[2](#ref-2), [3](#ref-3)].
It is a generalisation of the Witten index to superconformal field theories.
Given mutually commuting charges $G_i$ that commute with a chosen Poincaré supercharge $Q$ and its radial quantisation adjoint $Q^\dagger$, the index is given by the following trace over the Hilbert space of the theory

$$
\mathcal I(\{\kappa_i\})
=\operatorname{Tr}_{\mathcal H}
\left[
(-1)^F e^{-\beta\{Q,Q^\dagger\}}
\prod_i \kappa_i^{G_i}
\right].
\tag{2.1}
$$

where $F$ is the fermion number, $\beta$ an arbitrary constant, and the $\kappa_i$ are *fugacities* for the remaining charges. The canonical reviews are [[4](#ref-4), [5](#ref-5)]. I personally found Bourdier's thesis [[6](#ref-6)] quite illuminating. There is also a recent set of introductory lecture notes that seem quite nice [[7](#ref-7)].

Our interest is in 4d $\mathcal N=4$ super Yang-Mills theory.
In the $SU(N)$ case this theory appears on the conformal-field-theory side of the canonical duality between type-IIB string theory on $AdS_5\times S^5$ and $\mathcal N=4$ SYM.
The superconformal index therefore provides information about quantum gravity in asymptotically $AdS_5$ spacetime.

Now the index tracks *protected* states - states that do not change under continuous deformations - and thus serves as a natural probe of duality.
To reiterate, we are interested in S-duality, which relates the theory with gauge algebra $\mathfrak g$ to one with Langlands-dual algebra
$\mathfrak g^{\vee}$. For the semisimple classical families,

$$
B_n^\vee=C_n,
\qquad
C_n^\vee=B_n,
$$

so the theories with gauge algebras
$\mathfrak{so}(2n+1)$ and $\mathfrak{usp}(2n)$ are exchanged.
S-duality therefore predicts equality of their superconformal indices. That equality is physically natural but is not manifest in the corresponding matrix integrals. You can't just 'see it' when you stare at the integrals.

Spiridonov and Vartanov expressed the superconformal indices of
$\mathcal N=4$ SYM with simple gauge groups as elliptic hypergeometric
integrals [[8]](#ref-8).
They sharply stated the S-duality property as a conjectured equality between two integrals.
In particular, they proved this identity in several special
cases, but did not establish the generic finite-rank identity.

We are interested in a less refined version of the index, called the Schur index. This particular limit reduces the number of fugacities and thus becomes a coarser measure. While containing less information, it becomes far more tractable.
Notably, Bourdier, Drukker, and Felix were able to derive a beautiful convergent closed expression for the index with gauge group $U(N)$ [[1]](#ref-1)

$$
\mathcal I_{U(N)}(q)
=\frac{1}{\vartheta_4(0,q)}
\sum_{m=0}^{\infty}(-1)^m
\left[
\binom{N+m}{N}+\binom{N+m-1}{N}
\right]q^{mN+m^2}.
\tag{2.2}
$$

It is therefore desirable to derive a similar expression for the other classical groups (Problem 1) and use it to demonstrate S-duality (Problem 2).

There have been several attempts to make progress on this problem.

* Pan and Peelaers developed a residue method for multivariate elliptic integrals and used it to obtain closed-form flavoured indices for several low-rank theories. In particular, they evaluated the $SO(5)$ theory which should be dual to the $USp(4)$ theory [[9]](#ref-9).

* Hatsuda and Okazaki adapted the Fermi-gas approach of Bourdier, Drukker, and Felix. Using the Kronecker theta function and twisted Weierstrass functions, they obtained closed-form expressions for the Schur indices of 4d $\mathcal N=2^*$ SYM with unitary gauge groups at arbitrary rank [[10]](#ref-10). Equivalently, from the $\mathcal N=4$ perspective, this restores the flavour fugacity for the adjoint hypermultiplet and gives the flavoured unitary-group analogue of (2.2).

* Guo, Li, Pan, and Wang extended the elliptic-integration method and derived a closed analytic expression for the fully flavoured Schur index of the $\mathcal N=4$ $SO(7)$ theory, the first group with non-trivial duality [[11]](#ref-11).  They did not carry out the corresponding $USp(6)$ calculation.

* Du, Huang, and Wang studied the unflavoured indices of the $B_n$, $C_n$, $D_n$, and $G_2$ theories using both character expansion and an extension of the Fermi-gas method [[12]](#ref-12). For the cases they computed, they verified the equality of the $B_n$ and $C_n$ indices to high orders in the $q$-expansion. They also showed that the two families have the same stabilised large-$n$ index. However, they did not prove the $B_n/C_n$ equality at arbitrary rank.

* Ren and Huang recently studied a more general, three-parameter deformation of the Schur indices for the $B_n$, $C_n$, and $D_n$ theories using Koornwinder and Macdonald polynomials [[13]](#ref-13). In their coarser $u\to0$ degeneration the index reduces to a known multivariable Askey--Wilson integral and the $B_n/C_n$ S-duality becomes manifest. However, this does not establish equality of the Schur indices.

As far as I am aware there is no proof of the all-rank unflavoured $B_n/C_n$ Schur-index identity.
I think it is safe to say that proving this S-duality claim remains an open problem.

## 3 Unflavoured Schur index

The Schur index is naturally expressed in terms of elliptic functions.
We will work, in particular, with Jacobi elliptic functions.
These have a number of nice properties which we will use liberally [[14](#ref-14), [15](#ref-15), [16](#ref-16)].
Here we will establish notation and specify the integrals.
Define the elliptic nome $q=e^{i\pi\tau},\operatorname{Im}\tau>0$.
Write $\vartheta_j(a)=\vartheta_j(a\mid\tau)$,
$\vartheta_j=\vartheta_j(0\mid\tau)$, and $\eta=\eta(\tau)$.
Set

$$
k:=\frac{\vartheta_2^2}{\vartheta_3^2},
\qquad
v(a):=\vartheta_3^2a,
\qquad
\mathbf K(k)=\frac{\pi}{2}\vartheta_3^2.
\tag{3.1}
$$

Here $\mathbf K(k)$ is the complete elliptic integral of the first kind. For the Jacobi functions we usually parameterise by the quarter-periods

$$
K=\mathbf K(k),\qquad K'=\mathbf K(\sqrt{1-k^2}),
\qquad q=e^{-\pi K'/K}.
\tag{3.2}
$$

Introduce the parameterisation

$$
x(a):=\frac{\vartheta_1(a)^2}{\vartheta_4(a)^2}=k\operatorname{sn}^2(\vartheta_3^2a;k).
\tag{3.3}
$$

Thus the angular interval $0\leq a\leq\pi$ corresponds to one real period
$0\leq v\leq2\mathbf K(k)$. For $0<q<1$, this parametrization also shows
that $0\leq x(a)\leq k<1$.

Let
$d_n=n(2n+1)$, the common dimension of $B_n$ and $C_n$. Then

$$
\begin{aligned}
\mathcal I_{B_n}(q)
&=\frac{q^{-d_n/4}}{2^n n!}
\left(\frac{\eta^3}{\vartheta_4}\right)^n
\int_0^\pi\prod_{i=1}^n\frac{da_i}{\pi}
\prod_{i=1}^n x(a_i)
\prod_{i<j}x(a_i-a_j)x(a_i+a_j),
\end{aligned}
\tag{3.4}
$$

while

$$
\begin{aligned}
\mathcal I_{C_n}(q)
&=\frac{q^{-d_n/4}}{2^n n!}
\left(\frac{\eta^3}{\vartheta_4}\right)^n
\int_0^\pi\prod_{i=1}^n\frac{da_i}{\pi}
\prod_{i=1}^n x(2a_i)
\prod_{i<j}x(a_i-a_j)x(a_i+a_j).
\end{aligned}
\tag{3.5}
$$

From the Jacobi addition formula for $\operatorname{sn}$ we have, for all $a,b$ away from the poles,

$$
x(a+b)x(a-b)
=\left(\frac{x(a)-x(b)}{1-x(a)x(b)}\right)^2.
\tag{3.6}
$$

Define the one-body factors

$$
w_B(a)=\sqrt{k}\operatorname{sn}(v(a)),\quad w_C(a)=\sqrt{k}\operatorname{sn}(v(2a)).
\tag{3.7}
$$

The $B_n$ and $C_n$ root products in (3.4) and (3.5) can then be written
uniformly as

$$
\mathcal W_{G,n}(a_1,\ldots,a_n)
=\prod_{i=1}^n w_G(a_i)^2
 \prod_{i<j}\left(\frac{x(a_i)-x(a_j)}
 {1-x(a_i)x(a_j)}\right)^2,
\qquad G\in\{B,C\}.
\tag{3.8}
$$

## 4 The Kernel

The ordinary Cauchy determinant identity is

$$
\det_{1\leq i,j\leq n}\left(\frac{1}{1-x_ix_j}\right)
=\frac{\prod_{i<j}(x_i-x_j)^2}
{\prod_i(1-x_i^2)\prod_{i<j}(1-x_ix_j)^2},
\qquad x_i=x(a_i).
\tag{4.1}
$$

This is remarkably close to (3.8) - we just need to multiply by a row-factor.

$$
\begin{aligned}
\prod_iw_G(a_i)^2
  \prod_{i<j}\left(\frac{x_i-x_j}{1-x_ix_j}\right)^2 &=\prod_iw_G(a_i)^2(1-x_i^2)
  \det_{i,j}\left(\frac{1}{1-x_ix_j}\right)\\
&=\det_{i,j}\rho_G(a_i,a_j).
\end{aligned}
$$

where, for $G\in\lbrace B,C\rbrace$, we have introduced
the operator on $L^2([0,\pi],da/\pi)$ with kernel

$$
\begin{aligned}
\rho_B(a,b)
&=\frac{w_B(a)w_B(b)[1+x(a)][1-x(b)]}
{1-x(a)x(b)},\\
\rho_C(a,b)
&=\frac{w_C(a)w_C(b)[1+x(a)][1-x(b)]}
{1-x(a)x(b)}.
\end{aligned}
\tag{4.2}
$$

A more convenient expression is the following symmetric kernel

$$
\rho_G^{\mathrm s}(a,b)=
\frac{w_G(a)w_G(b)
\sqrt{[1-x(a)^2][1-x(b)^2]}}
{1-x(a)x(b)}.
\tag{4.3}
$$

This is related to (4.2) through a bounded similarity transformation (preserving spectra)

$$
\rho_G=M_h\rho_G^{\rm s}M_h^{-1},
\qquad
h(a)=\sqrt{\frac{1+x(a)}{1-x(a)}}.
$$

Here $M_f$ denotes multiplication by $f$.

For both root systems we can then write,

$$
\det_{1\leq i,j\leq n}\rho_G(a_i,a_j)
=\mathcal W_{G,n}(a_1,\ldots,a_n),
\qquad G\in\{B,C\}.
\tag{4.4}
$$

The Fredholm expansion packages all ranks into this single operator:

$$
\det(1+\kappa\rho_G)
=\sum_{n=0}^{\infty}\frac{\kappa^n}{n!}
\int_0^\pi\prod_{i=1}^n\frac{da_i}{\pi}\,
\det[\rho_G(a_i,a_j)].
$$

Therefore

$$
\mathcal I_{G_n}(q)
=q^{-n(2n+1)/4}
\left(\frac{\eta^3}{2\vartheta_4}\right)^n
[\kappa^n]\det(1+\kappa\rho_G).
\tag{4.5}
$$

Thus equality of the Fredholm determinants for $G=B,C$ proves equality of the indices at every rank.

## 5 Isospectrality

### 5.1 Reduction to a common Hilbert space

The kernels (4.2) and (4.3) are defined on the interval $(0,\pi)$.
Despite this they operate on distinct sectors.
$\rho_B$ acts nontrivially on functions symmetric about $\frac{\pi}{2}$ while $\rho_C$ acts on functions antisymmetric about $\frac{\pi}{2}$.
Given a function $f$ with the opposite reflection sign, i.e. $f(\pi-a)=-\epsilon_G f(a)$ for $a\in(0,\pi)$, where $\epsilon_B = 1$ and $\epsilon_C = -1$, the symmetric kernel annihilates it

$$
(\rho_G^{\mathrm s}f)(a)
=\int_0^{\pi/2}
\bigl[
\rho_G^{\mathrm s}(a,b)f(b)
+\rho_G^{\mathrm s}(a,\pi-b)f(\pi-b)
\bigr]\frac{db}{\pi} = 0
\tag{5.1}
$$

An even or odd function about $\pi/2$ is completely determined by its values on $0 \leq a \leq \pi/2$.
It therefore makes sense to consider a set of kernels defined on the same interval where the null sector is removed.

Let

$$
W_B(s)=k\operatorname{sn}^2s,\qquad
W_C(s)=k\operatorname{sn}^2(2s), \qquad
\Delta(s)=1-k^2\operatorname{sn}^4s.
\tag{5.2}
$$

Define an operator $\mathcal K_G$ on $L^2((0,K),ds/K)$ by

$$
(\mathcal K_Gf)(s)
=\int_0^K\mathcal K_G(s,t)f(t)\,\frac{dt}{K},
\tag{5.3}
$$

where

$$
\mathcal K_G(s,t)=
\sqrt{W_G(s)W_G(t)}
\frac{\sqrt{\Delta(s)\Delta(t)}}
{1-k^2\operatorname{sn}^2s\operatorname{sn}^2t}.
\tag{5.4}
$$

Take

$$
s=\vartheta_3^2a=\frac{2K}{\pi}a,
\qquad 0<a<\frac\pi2,\quad 0<s<K.
\tag{5.5}
$$

This kernel can be shown to be equivalent to the previous symmetric kernel up to the null sector, $\rho_G^{\rm s} = V_G \mathcal{K}_G V_G^\dagger$, where $V_G$ is the unitary map that extends a function from the half-interval with reflection sign $\epsilon_G$.

We now have a nice representation of the transition kernel acting on the Hilbert space $\mathscr H=L^2((0,K),ds/K)$.
For the operator proof we initially assume $0<q<1$, so $0<k<1$ and $K,K'>0$ are real. Equality of the Fredholm determinants, and hence of the Schur indices, then extends throughout $|q|<1$ by holomorphy.
The strategy moving forward is to demonstrate that these are isospectral.

### 5.2 A common Jacobi convolution

We adopt the convention where inner products on $\mathscr H$ are taken to be linear in the first argument.

The basic strategy is to factorise the kernels into a pair of adjoint operators

$$
\mathcal K_B = \mathcal A^\dagger \mathcal A, \qquad \mathcal K_C = \mathcal A \mathcal A^\dagger
$$

Why? Well, for one, it is clear that these two will have the same spectra (well, technically the same nonzero eigenvalues, including multiplicity).
Darboux operators seem to have a long history in these sorts of isospectral problems [[17]](#ref-17).
It is not, however, clear a priori what an appropriate $\mathcal A$ operator would look like.

The first step we take is to identify the common factors to both kernels and separate the two-variable dependence from the one-body factors.

Define the following operator

$$
(\mathcal Cf)(s)=
\int_0^K
\bigl[\operatorname{cn}(s-t)-\operatorname{cn}(s+t)\bigr]
f(t)\,\frac{dt}{K}.
\tag{5.6}
$$

From the Jacobi addition formula we have

$$
\operatorname{cn}(s-t)-\operatorname{cn}(s+t)
=\frac{2\operatorname{sn}s\operatorname{sn}t
\operatorname{dn}s\operatorname{dn}t}
{1-k^2\operatorname{sn}^2s\operatorname{sn}^2t}
\tag{5.7}
$$

Then with

$$
m_B(s)=\sqrt{\frac{k}{2}}
\frac{\sqrt{\Delta(s)}}{\operatorname{dn}s},
\qquad
m_C(s)=\sqrt{2k}
\frac{\operatorname{cn}s}{\sqrt{\Delta(s)}}
\tag{5.8}
$$

we obtain the decomposition.

$$
\mathcal K_B=M_{m_B}\mathcal CM_{m_B},
\qquad
\mathcal K_C=M_{m_C}\mathcal CM_{m_C}.
\tag{5.9}
$$

The $\mathcal C$ operator has some particularly nice properties. Let

$$
\omega_r=\frac{(2r+1)\pi}{2K},\qquad
e_r(s)=\sin(\omega_rs),\qquad
\xi_r=\frac{K'}2\omega_r.
\tag{5.10}
$$

From the Jacobi Fourier series for $\operatorname{cn}$ [[16]](#ref-16), it is easy to show

$$
\mathcal Ce_r=\gamma_re_r,\qquad
\gamma_r=\frac{\pi}{kK}\operatorname{sech}(2\xi_r).
\tag{5.11}
$$

(Hence $\mathcal C$, $\mathcal K_B$, and $\mathcal K_C$ are positive, trace-class (hence
compact), and injective.)

We ultimately want to show that the spectrum for these two operators is the same.
It is tempting to try a change of basis that diagonalises the quadratic form such as $d_r = M_{m_G}^{-1} e_r$. In this basis the kernels appear to be diagonalised.
This *may* be problematic however since $m_C(K)$ vanishes and consequently the $d_r$ would not be in $L^2$.

Instead consider the following bases,

$$
b_r=m_Be_r,\qquad c_r=m_Ce_r.
\tag{5.12}
$$

and the inverse operators $\mathcal K_G^{-1}$.
While it may not be the case that $\langle \mathcal K_C^{-1} c_r,c_\ell\rangle$ is well defined, the quadratic form $\langle \mathcal K_C^{-1/2} c_r, \mathcal K_C^{-1/2} c_\ell \rangle$ is.
In fact

$$
\begin{aligned}
\langle \mathcal K_B^{-1/2} b_r, \mathcal K_B^{-1/2} b_\ell \rangle
&=\frac{kK}{2\pi}\cosh(2\xi_r)\delta_{r\ell},\\
\langle \mathcal K_C^{-1/2} c_r, \mathcal{K}_C^{-1/2} c_\ell \rangle
&=\frac{kK}{2\pi}\cosh(2\xi_r)\delta_{r\ell}.
\end{aligned}
\tag{5.13}
$$

This follows immediately from (5.8)--(5.11).

If we write $\mathcal K_B^{-1} = \mathcal Q^\dagger \mathcal Q$ and $\mathcal K_C^{-1} = \mathcal R^\dagger \mathcal R$ then this is equivalent to

$$
\begin{aligned}
\langle \mathcal Q b_r, \mathcal Q b_\ell \rangle &=\frac{kK}{2\pi}\cosh(2\xi_r)\delta_{r\ell},\\
\langle \mathcal R c_r, \mathcal R c_\ell \rangle &=\frac{kK}{2\pi}\cosh(2\xi_r)\delta_{r\ell}.
\end{aligned}
$$

### 5.3 Darboux modes

We are going to construct a new basis.
Introduce two real half-angle functions by

$$
\begin{aligned}
\cos\theta(s)&=\frac{\operatorname{cn}s}{\sqrt{\Delta(s)}},&
\sin\theta(s)&=\frac{\operatorname{sn}s\operatorname{dn}s}
{\sqrt{\Delta(s)}},\\
\cos\varphi(s)&=\frac{\operatorname{dn}s}{\sqrt{\Delta(s)}},&
\sin\varphi(s)&=\frac{k\operatorname{sn}s\operatorname{cn}s}
{\sqrt{\Delta(s)}}.
\end{aligned}
\tag{5.14}
$$

The addition formulas mean we have the following nice properties

$$
\begin{aligned}
\cos(2\theta)&=\operatorname{cn}(2s),&
\sin(2\theta)&=\operatorname{sn}(2s),\\
\cos(2\varphi)&=\operatorname{dn}(2s),&
\sin(2\varphi)&=k\operatorname{sn}(2s).
\end{aligned}
\tag{5.15}
$$

Define

$$
\begin{aligned}
\Phi_r(s)
&=\cosh\xi_r\cos\theta(s)\sin(\omega_rs)
 +\sinh\xi_r\sin\theta(s)\cos(\omega_rs),\\
\Psi_r(s)
&=\cosh\xi_r\cos\varphi(s)\sin(\omega_rs)
 -\sinh\xi_r\sin\varphi(s)\cos(\omega_rs).
\end{aligned}
\tag{5.16}
$$

These functions have the following remarkable orthogonality properties.

$$
\begin{aligned}
\langle\Phi_r,\Phi_\ell\rangle
&=\frac14\cosh(2\xi_r)\delta_{r\ell},\\
\langle\Psi_r,\Psi_\ell\rangle
&=\frac14\cosh(2\xi_r)\delta_{r\ell},
\end{aligned}
\tag{5.17}
$$

Put $L=\pi K'/K$, $\alpha=\pi/(2kK)$, and
$\beta=\pi/(2K)$.  The following Fourier coefficients are straightforward to compute

$$
\begin{array}{c|cc}
&j\text{ odd}&j\text{ even}\\ \hline
\int_0^K \frac{ds}{K}\operatorname{cn}(2s)\cos(j\pi s/K)
&\alpha\operatorname{sech}(jL/2)&0\\
\int_0^K \frac{ds}{K}\operatorname{sn}(2s)\sin(j\pi s/K)
&\alpha\operatorname{csch}(jL/2)&0\\
\int_0^K \frac{ds}{K}\operatorname{dn}(2s)\cos(j\pi s/K)
&0&\beta\operatorname{sech}(jL/2)\\
\int_0^K \frac{ds}{K}k\operatorname{sn}(2s)\sin(j\pi s/K)
&\beta\operatorname{csch}(jL/2)&0\\
\int_0^K \frac{ds}{K} \tan\varphi(s)\sin(j\pi s/K)
& 2\alpha\operatorname{csch}(jL)&0
\end{array}
\tag{5.18}
$$

Evaluating the expressions is a somewhat extremely tedious but straightforward exercise.
For $\langle \Phi_r,\Phi_\ell \rangle$ and $\langle \Psi_r, \Psi_\ell \rangle$ one obtains an expression in the Fourier coefficients labelled by $d=r-\ell$ and $p=r+\ell+1$. Since these have opposite parity, you only need to consider the two cases where $d$ is odd and $p$ even and vice versa to evaluate all possible outcomes; the result being that all non-diagonal *elliptic* contributions cancel out. I was quite impressed by how clean the calculation ended up being.

One can further show that these two systems are *complete* and two distinct orthonormal bases can be constructed from them.

**Where do these functions come from?**
We have found two distinct bases in which the quadratic form is identical.
These bases may not be orthogonal to each other.
But why these?
If we take the basis functions $e_r = \sin(\omega_rs)$, then we can reproduce the $\cosh(\xi_r)$ by considering a pure imaginary shift:

$$
\sin(\omega_r(s\pm ia)) = \cosh(\omega_r a)\sin(\omega_r s) \pm i \sinh(\omega_r a)\cos(\omega_r s)
$$

so if we take $a = K'/2$ we get

$$
\sin(\omega_r(s\pm ia)) = \cosh(\xi_r)\sin(\omega_r s) \pm i \sinh(\xi_r)\cos(\omega_r s).
$$

A linear combination of the same function with the argument shifted by the same positive and negative imaginary value will give the $\cosh(\xi_r)$ terms.
This is the kind of operator we are after, so it makes sense to consider what this operation would look like on $b_r$ and $c_\ell$.
These functions have the additional $m_B$ and $m_C$ dressings that we have to consider.

Using the definition of $\theta(s)$ at the beginning of this section we have

$$
m_B(s\pm ia)= \frac{1\pm i}{\sqrt{2}} \sqrt{k \operatorname{sn}(2s)}\frac{\operatorname{cn}(s) \mp i\operatorname{sn}(s)\operatorname{dn}(s)}{\sqrt{\Delta(s)}} = \frac{1\pm i}{\sqrt{2}} \sqrt{k \operatorname{sn}(2s)} e^{\mp i\theta(s)}
$$

Although the natural choice would be to consider $b_r(s+ia) + b_r(s-ia)$, you actually get a simpler expression if you choose

$$
\begin{aligned}
b_r(s+ia)+ib_r(s-ia)
={}&
\cosh{\xi_r}
\left[m_B(s+ia)+im_B(s-ia)\right]
\sin(\omega_rs)\\
&+
\sinh{\xi_r}
\left[i m_B(s+ia)+m_B(s-ia)\right]
\cos(\omega_rs).
\end{aligned}
$$

We can then extract a global constant complex factor and the real and imaginary parts as follows

$$
\begin{aligned}
m_B(s+ia) + i m_B(s-ia) & = (1+i)\sqrt{2k\operatorname{sn}(2s)}\cos(\theta(s))\\
i m_B(s+ia) + m_B(s-ia) & = (1+i)\sqrt{2k\operatorname{sn}(2s)}\sin(\theta(s))
\end{aligned}
$$

Together we then have

$$
\frac{1}{\sqrt{k\operatorname{sn}(2s)}}\left[b_r(s+ia)+i b_r(s-ia)\right] = (1+i)\sqrt{2}\Phi_r.
$$

Similar reasoning recovers the $\Psi_\ell$ definition from the $c_\ell$ functions.

It is not clear to me at all why one would *start* from $b_r(s+ia)+ib_r(s-ia)$ other than that it generates a simple result.
To see that the resulting basis has the correct inner product is not obvious.
Aside from considering an arbitrary linear combination and computing the inner product, this appears to be a somewhat inspired choice.

### 5.4 Darboux operators

We now introduce the operators $\mathcal{Q}$ and $\mathcal{R}$, defined by their action on the bases:

$$
 \mathcal Q b_n=(1+i)\sqrt{\frac{kK}{\pi}}\,\Phi_n,
 \tag{5.19}
$$

and

$$
 \mathcal R c_n=(1-i)\sqrt{\frac{kK}{\pi}}\,\Psi_n.
 \tag{5.20}
$$

By (5.17),

$$
 \langle \mathcal Qb_m,\mathcal Qb_n\rangle=\frac{kK}{2\pi}\cosh(2\xi_n)\delta_{mn}.
 \tag{5.21}
$$

Similarly,

$$
 \langle \mathcal R c_m,\mathcal R c_n\rangle
 =\frac{kK}{2\pi}\cosh(2\xi_n)\delta_{mn}.
 \tag{5.22}
$$

Then for any function $f=\sum_n a_nb_n$ we have

$$
 \|\mathcal Qf\|^2
 =\frac{kK}{2\pi}
 \sum_n|a_n|^2\cosh(2\xi_n)
 = \langle \mathcal K_B^{-1/2} f, \mathcal K_B^{-1/2} f\rangle.
 \tag{5.23}
$$

Likewise, for $g=\sum_na_nc_n$,

$$
 \|\mathcal Rg\|^2
 = \langle \mathcal K_C^{-1/2} g, \mathcal K_C^{-1/2} g\rangle.
 \tag{5.24}
$$

It appears as though we have constructed operators that represent $\mathcal K_G^{-1/2}$.
We can write

$$
\mathcal{K}_B^{-1} = \mathcal Q^\dagger \mathcal Q, \qquad \mathcal{K}_C^{-1} = \mathcal R^\dagger \mathcal R.
$$

To connect these two, consider two functions $f \in \operatorname{span}\lbrace b_n:n\ge0\rbrace$ and $g \in \operatorname{span}\lbrace c_n:n\ge0\rbrace$. Then

$$
 \langle \mathcal Q f,g\rangle
 =\langle f,\mathcal R g\rangle.
 \tag{5.25}
$$

Because the two sides are sesquilinear, it is enough to prove this for $f=b_n$ and $g=c_m$. Since all of $b_n,c_m,\Phi_n,\Psi_m$ are real-valued and our inner product is linear in the first argument, (5.19)--(5.20) reduce (5.25) to

$$
 \langle\Phi_n,c_m\rangle
 =\langle b_n,\Psi_m\rangle.
 \tag{5.26}
$$

This calculation again uses the Fourier coefficients in (5.18).
Evaluating the integrals yields a linear combination of Fourier coefficients labelled by $d = n-m$ and $p = n+m+1$.
In each of the parity configurations the expression evaluates to zero.

Therefore we have

$$
 \mathcal R = \mathcal Q^\dagger,
 \qquad
 \mathcal Q = \mathcal R^\dagger.
 \tag{5.27}
$$

(There are some subtle technical details about the domains on which these operators act and completeness needed to solidly establish that they are mutually adjoint, but we will gloss over them here. The result still holds.)

And finally

$$
\mathcal K_B^{-1}=\mathcal Q^\dagger\mathcal Q,
\qquad
\mathcal K_C^{-1}=\mathcal Q\mathcal Q^\dagger.
\tag{5.28}
$$

This is the duality statement at the inverse-transfer-matrix level.  To
return to the compact transfer matrices, define

$$
\mathcal A=(\mathcal Q^\dagger)^{-1}.
\tag{5.29}
$$

Then

$$
\mathcal K_B=\mathcal A^\dagger\mathcal A,
\qquad
\mathcal K_C=\mathcal A\mathcal A^\dagger.
\tag{5.30}
$$

Hence $\mathcal K_B$ and $\mathcal K_C$ have the same nonzero eigenvalues with the same multiplicities. This is sufficient to establish equality of their Fredholm determinants and therefore equality of the $B_n$ and $C_n$ indices.

We can represent these operators by their action on a function $f\in\mathscr H$,

$$
\mathcal Af
=
2(1+i)\sqrt{\frac{\pi}{kK}}
\sum_{r=0}^{\infty}
\frac{\langle f,\Psi_r\rangle}
{\cosh(2\xi_r)}\,c_r.
$$

Likewise,

$$
\mathcal A^\dagger f
=
2(1-i)\sqrt{\frac{\pi}{kK}}
\sum_{r=0}^{\infty}
\frac{\langle f,\Phi_r\rangle}
{\cosh(2\xi_r)}\,b_r.
$$

and $(\mathcal A^\dagger)^\dagger$ and $\mathcal A$ agree because of the nontrivial identity

$$
\sum_{r=0}^{\infty}
\frac{\langle f,b_r\rangle}
{\cosh(2\xi_r)}\,\Phi_r
=
\sum_{r=0}^{\infty}
\frac{\langle f,\Psi_r\rangle}
{\cosh(2\xi_r)}\,c_r.
$$

## 6 Conclusions

What this approach reveals is that equality of all the integrals has a one-particle explanation: the $B_n$ and $C_n$ transfer operators are intertwined.
This is a stronger claim than simply demonstrating the integrals are the same.
Perhaps this is over-indexing on the Bourdier, Drukker, Felix paper, where the diagonal transfer operator easily allows you to evaluate the integral.
I personally suspected that evaluating the entire integral would be the key to demonstrating this duality. As if some non-trivial cancellation occurs that gives you the same $q$-expansion coefficients.

In older models (I was using the Plus plan then) I had seen echoes of this strategy in the reasoning traces, i.e. that there may be a Darboux factorisation, and I completely dismissed them.
Not without a fair shake though, I would try to go through the calculation carefully and usually there was some other issue in the derivation. Most of the time they would focus on the $n=1,2$ cases which are quite trivial and draw broadly wrong conclusions. I think what is surprising in the latest generation is how good they have become at checking their work and being coherent over long time windows. Trying to reverse-engineer the reasoning for some of the choices took more time than I expected.

How can we build on this? At the end of the day this problem was focussed on the *unflavoured Schur* index. A coarse limit of the original superconformal index.
The most obvious next step is to consider the Schur index with flavour fugacities switched on. I have handed this to Codex which has proposed a plausible-looking response (for one, it introduced a variant of the Kronecker theta function that was deployed successfully in the $SU(n)$ case [[10]](#ref-10)) - although I haven't verified it yet. Maybe I will add to this once I have digested the argument. There are other refinements of the index one might consider. I think the ultimate goal would be to demonstrate full S-duality of the superconformal index in terms of elliptic hypergeometric integrals as Spiridonov and Vartanov proposed. But we'll leave it there for now.

## 7 Addendum

I had a go at feeding the original artifact and an earlier version of this condensed draft to GPT-5.6 Sol Pro again and asked it to make a cleaner proof. I then thought it might ease my anxiety somewhat if I could translate the output into Lean. Being a complete novice, however, that was a bit of a tall order. So I tried using [Aristotle](https://www.harmonic.fun/), by Harmonic. The first draft didn't actually give a complete presentation of the argument, so I got Codex to try and fill the rest out. You can both see the cleaner presentation (TeX file) and interact with the Lean formalisation [here](https://github.com/Aravinth-K/lean-schur-index-s-duality).

## 8 References

1. <a id="ref-1"></a>J. Bourdier, N. Drukker, and J. Felix, “[The exact Schur index of 𝒩 = 4 SYM](https://doi.org/10.1007/JHEP11(2015)210),” *Journal of High Energy Physics* **2015**, 210 (2015). [arXiv:1507.08659](https://arxiv.org/abs/1507.08659).
2. <a id="ref-2"></a>C. Romelsberger, “[Counting chiral primaries in $N=1$, $d=4$ superconformal field theories](https://doi.org/10.1016/j.nuclphysb.2006.03.037),” *Nuclear Physics B* **747**, 329–353 (2006). [arXiv:hep-th/0510060](https://arxiv.org/abs/hep-th/0510060).
3. <a id="ref-3"></a>J. Kinney, J. M. Maldacena, S. Minwalla, and S. Raju, “[An Index for 4 dimensional Super Conformal Theories](https://doi.org/10.1007/s00220-007-0258-7),” *Communications in Mathematical Physics* **275**, 209–254 (2007). [arXiv:hep-th/0510251](https://arxiv.org/abs/hep-th/0510251).
4. <a id="ref-4"></a>L. Rastelli and S. S. Razamat, “[The supersymmetric index in four dimensions](https://doi.org/10.1088/1751-8121/aa76a6),” *Journal of Physics A: Mathematical and Theoretical* **50**, 443013 (2017). [arXiv:1608.02965](https://arxiv.org/abs/1608.02965).
5. <a id="ref-5"></a>A. Gadde, L. Rastelli, S. S. Razamat, and W. Yan, “[Gauge Theories and Macdonald Polynomials](https://doi.org/10.1007/s00220-012-1607-8),” *Communications in Mathematical Physics* **319**, 147–193 (2013). [arXiv:1110.3740](https://arxiv.org/abs/1110.3740).
6. <a id="ref-6"></a>J. Bourdier, “[The Schur index of 4d $\mathcal N=2$ superconformal field theories](https://kclpure.kcl.ac.uk/portal/en/studentTheses/the-schur-index-of-4d-n2-superconformal-field-theories/),” PhD thesis, King's College London (2017).
7. <a id="ref-7"></a>A. Gadde, “[Lectures on the Superconformal Index](https://doi.org/10.1088/1751-8121/ac42ac),” *Journal of Physics A: Mathematical and Theoretical* **55**, 063001 (2022). [arXiv:2006.13630](https://arxiv.org/abs/2006.13630).
8. <a id="ref-8"></a>V. P. Spiridonov and G. S. Vartanov, “[Superconformal indices of $\mathcal N=4$ SYM field theories](https://doi.org/10.1007/s11005-011-0537-2),” *Letters in Mathematical Physics* **100**, 97–118 (2012). [arXiv:1005.4196](https://arxiv.org/abs/1005.4196).
9. <a id="ref-9"></a>Y. Pan and W. Peelaers, “[The exact Schur index in closed form](https://doi.org/10.1103/PhysRevD.106.045017),” *Physical Review D* **106**, 045017 (2022). [arXiv:2112.09705](https://arxiv.org/abs/2112.09705).
10. <a id="ref-10"></a>Y. Hatsuda and T. Okazaki, “[$\mathcal N=2^*$ Schur indices](https://doi.org/10.1007/JHEP01(2023)029),” *Journal of High Energy Physics* **2023**, 029 (2023). [arXiv:2208.01426](https://arxiv.org/abs/2208.01426).
11. <a id="ref-11"></a>Z. Guo, Y. Li, Y. Pan, and Y. Wang, “[$\mathcal N=2$ Schur index and line operators](https://doi.org/10.1103/PhysRevD.108.106002),” *Physical Review D* **108**, 106002 (2023). [arXiv:2307.15650](https://arxiv.org/abs/2307.15650).
12. <a id="ref-12"></a>B.-n. Du, M.-x. Huang, and X. Wang, “[Schur indices for $\mathcal N=4$ super-Yang--Mills with more general gauge groups](https://doi.org/10.1007/JHEP03(2024)009),” *Journal of High Energy Physics* **2024**, 009 (2024). [arXiv:2311.08714](https://arxiv.org/abs/2311.08714).
13. <a id="ref-13"></a>G.-f. Ren and M.-x. Huang, “[Deformed Schur indices of $BCD$-type for $\mathcal N=4$ super Yang--Mills and symmetric functions](https://doi.org/10.1007/JHEP01(2026)107),” *Journal of High Energy Physics* **2026**, 107 (2026). [arXiv:2507.11315](https://arxiv.org/abs/2507.11315).
14. <a id="ref-14"></a>E. T. Whittaker and G. N. Watson, “[*A Course of Modern Analysis*](https://doi.org/10.1017/CBO9780511608759),” 4th ed., Cambridge University Press (1927; reprinted 1996).
15. <a id="ref-15"></a>D. F. Lawden, “[*Elliptic Functions and Applications*](https://doi.org/10.1007/978-1-4757-3980-0),” Applied Mathematical Sciences, vol. 80, Springer-Verlag, New York (1989).
16. <a id="ref-16"></a>W. P. Reinhardt and P. L. Walker, “[Jacobian Elliptic Functions](https://dlmf.nist.gov/22),” Chapter 22 in the *NIST Digital Library of Mathematical Functions*, Release 1.2.7 (2026); see [§22.11, Fourier and Hyperbolic Series](https://dlmf.nist.gov/22.11).
17. <a id="ref-17"></a>H. C. Rosu, “[Short survey of Darboux transformations](https://arxiv.org/abs/quant-ph/9809056),” in *Symmetries in Quantum Mechanics and Quantum Optics*, F. J. Herranz, A. Ballesteros, L. M. Nieto, J. Negro, and C. M. Pereña, eds., Servicio de Publicaciones, Universidad de Burgos, pp. 301–315 (1999). [arXiv:quant-ph/9809056](https://arxiv.org/abs/quant-ph/9809056).
