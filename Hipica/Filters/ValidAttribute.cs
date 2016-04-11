﻿using System.Web.Http;
using System.Web.Http.Controllers;

namespace Hipica.Filters
{
    public class ValidAttribute : ParameterBindingAttribute
    {
        public override HttpParameterBinding GetBinding(HttpParameterDescriptor parameter)
        {
            return new ValidParameterBinding(parameter);
        }
    }
}