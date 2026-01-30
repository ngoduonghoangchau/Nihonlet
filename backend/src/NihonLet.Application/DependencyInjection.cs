using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace NihonLet.Application;

/// <summary>
/// Extension methods để đăng ký các services của Application layer
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();
        
        // MediatR
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(assembly));
        
        // FluentValidation
        services.AddValidatorsFromAssembly(assembly);
        
        // AutoMapper - sẽ scan assembly để tìm Profile classes
        services.AddAutoMapper(cfg => { }, assembly);
        
        return services;
    }
}
