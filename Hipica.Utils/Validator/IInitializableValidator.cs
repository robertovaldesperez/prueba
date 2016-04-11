﻿using NHibernate.Validator.Engine;
using System;

namespace Hipica.Utils.Validator
{
    public abstract class IInitializableValidator<A, E> : NHibernate.Validator.Engine.IInitializableValidator<A>
        where A : Attribute
        where E : class
    {
        protected abstract void Initialize2(A parameters);

        protected abstract bool IsValid2(E value, IConstraintValidatorContext context);

        public void Initialize(A parameters)
        {
            this.Initialize2(parameters);
        }

        public bool IsValid(object value, IConstraintValidatorContext context)
        {
            return this.IsValid2((E)value, context);
        }
    }
}